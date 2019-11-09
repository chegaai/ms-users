import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { UserRepository } from '../data/repositories/UserRepository'
import { UserNotFoundError } from '../domain/user/errors/UserNotFoundError'
import { UserAlreadyExistsError } from '../domain/user/errors/UserAlreadyExistsError'
import { User } from '../domain/user/User'
import { CreateUserData } from '../domain/user/structures/CreateUserData'
import { Crypto } from '../utils/Crypto'
import { InvalidLoginError } from '../domain/user/errors/InvalidLoginError'
import { JWT } from '../utils/JWT'
import { GroupClient } from '../data/repositories/GroupClient'
import { GroupNotFoundError } from '../domain/user/errors/GroupNotFoundError'

@injectable()
export class UserService {
  constructor (
    private readonly repository: UserRepository,
    private readonly groupClient: GroupClient,
    private readonly crypto: Crypto,
    private readonly jwt: JWT
  ) { }

  async create (creationData: CreateUserData): Promise<any> {
    if (await this.repository.existsByDocument(creationData.document)) throw new UserAlreadyExistsError('document', creationData.document)
    if (await this.repository.existsByEmail(creationData.email)) throw new UserAlreadyExistsError('email', creationData.email)

    // TODO: send the image to cloud

    creationData.password = await this.crypto.encrypt(creationData.password)
    const user: User = User.create(new ObjectId(), creationData)

    return this.repository.save(user)
  }

  async update (id: string, dataToUpdate: Partial<CreateUserData>): Promise<User> {
    const user = await this.repository.findById(id)
    if (!user || user.deletedAt) throw new UserNotFoundError(id)

    const updatedData = {
      ...user.toObject(),
      ...dataToUpdate
    }

    user.update(updatedData)

    return this.repository.save(user)
  }

  async delete (id: string): Promise<void> {
    const user = await this.repository.findById(id)
    if (!user) return

    user.delete()

    await this.repository.save(user)
  }

  async find (id: string): Promise<User> {
    const user = await this.repository.findById(id)

    if (!user) throw new UserNotFoundError(id)
    return user
  }

  async authenticate (handle: string, plainPassword: string) {
    const user = await this.repository.findByHandle(handle)
    if (!user) throw new UserNotFoundError(handle)

    if (!await this.crypto.verify(plainPassword, user.password)) throw new InvalidLoginError()

    return this.jwt.sign(user)
  }

  async followGroup (userId: string, groupId: string) {
    if (!ObjectId.isValid(groupId)) throw new TypeError('Invalid group ID')

    const user = await this.repository.findById(userId)
    if (!user || user.deletedAt) throw new UserNotFoundError(userId)


    const group = await this.groupClient.findGroupById(groupId)
    if (!group) throw new GroupNotFoundError(groupId)

    user.followGroup(new ObjectId(groupId))

    await this.repository.save(user)

    return user
  }

  async unfollowGroup (userId: string, groupId: string) {
    if (!ObjectId.isValid(groupId)) throw new TypeError('Invalid group ID')

    const user = await this.repository.findById(userId)
    if (!user || user.deletedAt) throw new UserNotFoundError(userId)


    const group = await this.groupClient.findGroupById(groupId)
    if (!group) throw new GroupNotFoundError(groupId)

    user.unfollowGroup(new ObjectId(groupId))

    await this.repository.save(user)

    return user
  }

  async listAll (page: number, size: number): Promise<PaginatedQueryResult<User>> {
    return this.repository.getAll(page, size)
  }
}
