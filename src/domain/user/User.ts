import { ObjectId } from 'bson'
import { CreateUserData } from './structures/CreateUserData'
import { BaseEntity, BaseEntityData } from '../BaseEntity'

export type SocialNetworkObject = { name: string, link: string }
export interface LocationObject {
  country: string
  state: string
  city: string
}

export enum UserRoles {
  USER = 'user',
  ADMIN = 'admin'
}

export class User extends BaseEntity {
  id: ObjectId = new ObjectId()
  username: string = ''
  name: string = ''
  email: string = ''
  picture: string = ''
  socialNetworks: SocialNetworkObject[] = []
  location: LocationObject = {
    city: '',
    country: '',
    state: ''
  }
  document: string = ''
  groups: ObjectId[] = []
  tags: string[] = []
  role: UserRoles = UserRoles.USER

  static create (id: ObjectId, data: CreateUserData & BaseEntityData): User {
    const user = new User()
    user.id = id
    user.name = data.name
    user.document = data.document
    user.groups = data.groups
    user.location = data.location
    user.picture = data.picture
    user.email = data.email
    user.username = data.username
    user.role = data.role
    user.socialNetworks = data.socialNetworks
    user.tags = data.tags

    if (data.createdAt) user.createdAt = data.createdAt
    if (data.deletedAt) user.deletedAt = data.deletedAt
    if (data.updatedAt) user.updatedAt = data.updatedAt

    return user
  }

  update (dataToUpdate: CreateUserData): User {
    this.name = dataToUpdate.name
    this.name = dataToUpdate.name
    this.document = dataToUpdate.document
    this.groups = dataToUpdate.groups
    this.location = dataToUpdate.location
    this.picture = dataToUpdate.picture
    this.email = dataToUpdate.email
    this.username = dataToUpdate.username
    this.role = dataToUpdate.role
    this.socialNetworks = dataToUpdate.socialNetworks
    this.tags = dataToUpdate.tags
    this.updatedAt = new Date()
    return this
  }

  toObject () {
    return {
      _id: this.id,
      username: this.username,
      name: this.name,
      email: this.email,
      picture: this.picture,
      socialNetworks: this.socialNetworks,
      location: {
        country: this.location.country,
        state: this.location.state,
        city: this.location.city
      },
      document: this.document,
      groups: this.groups,
      tags: this.tags,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}