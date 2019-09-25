import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { UserRepository } from '../data/repositories/UserRepository'
import { UserNotFoundError } from '../domain/user/errors/UserNotFoundError'
import { UserAlreadyExistsError } from '../domain/user/errors/UserAlreadyExistsError'
import { User } from '../domain/user/User'
import { CreateUserData } from '../domain/user/structures/CreateUserData'

@injectable()
export class UserService {
  constructor (
    private readonly repository: UserRepository
  ) { }

  async create (creationData: CreateUserData): Promise<User> {
    if (await this.repository.existsByDocument(creationData.document)) throw new UserAlreadyExistsError(creationData.document)

    // TODO: send the image to cloud

    const user: User = User.create(new ObjectId(), creationData)

    return this.repository.save(user)
  }

  async update (id: string, dataToUpdate: Partial<CreateUserData>): Promise<User> {
    const currentUser = await this.repository.findById(id)
    if (!currentUser) throw new UserNotFoundError(id)

    const newUser: User = {
      ...currentUser,
      ...dataToUpdate,
      id: new ObjectId(id),
      updatedAt: new Date()
    }

    return this.repository.save(newUser)
  }

  async delete (id: string): Promise<void> {
    const user = await this.repository.findById(id)
    if (!user) return
    user.deletedAt = new Date()

    await this.repository.save(user)
  }

  async find (id: string): Promise<User> {
    const user = await this.repository.findById(id)

    if (!user) throw new UserNotFoundError(id)
    return user
  }

  async listAll (): Promise<PaginatedQueryResult<User>> {
    return this.repository.getAll()
  }
}
