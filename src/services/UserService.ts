import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { ObjectId } from 'bson'
import { inject, injectable } from 'tsyringe'
import { PasswordResetTemplate } from '../data/clients/mail-templates/PasswordResetTemplate'
import { MailClient } from '../data/clients/MailClient'
import { ProfileClient } from '../data/clients/ProfileClient'
import { ProfileCreationParams } from '../data/clients/structures/ProfileCreationParams'
import { UserRepository } from '../data/repositories/UserRepository'
import { InvalidLoginError } from '../domain/user/errors/InvalidLoginError'
import { UserAlreadyExistsError } from '../domain/user/errors/UserAlreadyExistsError'
import { UserNotFoundError } from '../domain/user/errors/UserNotFoundError'
import { CreateUserData } from '../domain/user/structures/CreateUserData'
import { User } from '../domain/user/User'
import { Crypto } from '../utils/Crypto'
import { JWT } from '../utils/JWT'
import { InvalidPasswordError } from './errors/InvalidPasswordError'
import { InvalidTokenError } from './errors/InvalidTokenError'
import { UserUpdateData } from './structures/types/UserUpdateData'

function validateTokenPayload (payload: { sub?: string, action?: string } | string, expectedAction: string) {
  if (typeof payload === 'string') throw new InvalidTokenError(payload)
  const { sub, action } = payload as { sub?: string, action?: string }
  if (!sub || !action) throw new InvalidTokenError('token is missing properties')
  if (action !== expectedAction) throw new InvalidTokenError(`token action (${action}) is invalid`)
  if (!ObjectId.isValid(sub)) throw new InvalidTokenError(`token subject (${sub}) is invalid`)
  return { sub, action }
}

@injectable()
export class UserService {
  constructor (
    private readonly repository: UserRepository,
    private readonly crypto: Crypto,
    private readonly jwt: JWT,
    private readonly mailClient: MailClient,
    @inject('ProfileClient') private readonly profileClient: ProfileClient
  ) { }

  async ensureUserDoesNotExist ({ document, username }: CreateUserData) {
    if (await this.repository.existsByDocument(document)) {
      throw new UserAlreadyExistsError('document', document)
    }

    if (await this.repository.existsByUsername(username)) {
      throw new UserAlreadyExistsError('username', username)
    }
  }

  async create (creationData: CreateUserData, profileData: Omit<ProfileCreationParams, 'id'>) {
    await this.ensureUserDoesNotExist(creationData)

    creationData.password = await this.crypto.encrypt(creationData.password)
    const user: User = User.create(new ObjectId(), creationData)

    await this.repository.save(user)
    const profile = await this.profileClient.createProfile({ id: user.id.toHexString(), ...profileData })

    return { user, profile }
  }

  async delete (id: string): Promise<void> {
    const user = await this.repository.findById(id)
    if (!user) return

    user.delete()
    await this.repository.save(user)

    await this.profileClient.delete(id)
  }

  async find (id: string): Promise<User> {
    const user = await this.repository.findById(id)

    if (!user) throw new UserNotFoundError(id)

    return user
  }

  async authenticate (handle: string, plainPassword: string) {
    const user = await this.repository.findByHandle(handle)
    if (!user) throw new UserNotFoundError(handle)

    if (!await this.crypto.verify(plainPassword, user.password)) {
      throw new InvalidLoginError()
    }

    return this.jwt.signUser(user)
  }

  async requestPasswordRecovery (email: string) {
    const user = await this.repository.findByEmail(email)
    if (!user) return

    const payload = { action: 'recover-password' }
    const token = this.jwt.signPayload(payload, user.id.toHexString(), '1d')
    const template = new PasswordResetTemplate(token)

    await this.mailClient.send('Redefinição de senha chega.ai', user.email, template)
  }

  async recoverPassword (token: string, newPassword: string) {
    const payload = this.jwt.verify(token)
    const { sub: userId } = validateTokenPayload(payload, 'recover-password')

    const user = await this.find(userId)
    const password = await this.crypto.encrypt(newPassword)
    user.password = password

    await this.repository.save(user)
  }

  async setPassword (id: string, oldPassword: string, newPassword: string) {
    const user = await this.find(id)

    if (!(await this.crypto.verify(oldPassword, user.password))) {
      throw new InvalidPasswordError('given password does not match current one')
    }

    user.password = await this.crypto.encrypt(newPassword)
    await this.repository.save(user)
  }

  async listAll (page: number, size: number): Promise<PaginatedQueryResult<User>> {
    return this.repository.getAll(page, size)
  }

  async update (id: string, data: UserUpdateData): Promise<User> {
    const user = await this.find(id)

    if (data.username){
      if (await this.repository.existsByUsername(data.username)) {
        throw new UserAlreadyExistsError('username', data.username)
      }
      user.username = data.username
    } 

    if (data.email){
      if (await this.repository.existsByEmail(data.email)) {
        throw new UserAlreadyExistsError('email', data.email)
      }
      user.email = data.email
    } 
    
    if (data.document){
      if (await this.repository.existsByEmail(data.document)) {
        throw new UserAlreadyExistsError('document', data.document)
      }
      user.document = data.document
    } 

    await this.repository.save(user)

    return user
  }

  async existsByUsername (username: string) {
    return this.repository.existsByUsername(username)
  }
}
