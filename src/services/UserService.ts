import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { IUser, IUserParams } from '../domain/user/structures'
import { UserRepository } from '../data/repositories/UserRepository'
import { UserNotFoundError } from '../domain/user/errors/UserNotFoundError'
import { UserAlreadyExistsError } from '../domain/user/errors/UserAlreadyExistsError'

@injectable()
export class UserService {
  constructor (
    private readonly repository: UserRepository
  ) { }

  async create (creationData: IUserParams): Promise<IUser> {
    if (await this.repository.existsByDocument(creationData.document)) throw new UserAlreadyExistsError(creationData.document)
    
    // TODO: send the image to cloud

    const user: IUser = {
      id: new ObjectId(),
      username: creationData.username,
      name: {
        first: creationData.name.first,
        last: creationData.name.last,
      },
      email: creationData.email,
      picture: creationData.picture,
      socialNetworks:{
          facebook: creationData.socialNetworks.facebook,
          linkedin: creationData.socialNetworks.linkedin,
          twitter: creationData.socialNetworks.twitter,
          medium: creationData.socialNetworks.medium,
          speakerDeck: creationData.socialNetworks.speakerDeck,
          pinterest: creationData.socialNetworks.pinterest,
          instagram: creationData.socialNetworks.instagram,
          others: creationData.socialNetworks.others
      },
      location: {
          coutry: creationData.location.coutry,
          state: creationData.location.state,
          city: creationData.location.city
      },
      document: creationData.document,
      groups: [],
      tags: creationData.tags,
      services: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    return this.repository.save(user)
  }

  async update (id: string, dataToUpdate: Partial<IUserParams>): Promise<IUser> {
    const currentUser = await this.repository.findById(id)
    if (!currentUser) throw new UserNotFoundError(id)

    const newUser: IUser = {
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

  async find (id: string): Promise<IUser> {
    const user = await this.repository.findById(id)

    if (!user) throw new UserNotFoundError(id)
    return user
  }

  async listAll (): Promise<PaginatedQueryResult<IUser>> {
    return this.repository.getAll()
  }
}
