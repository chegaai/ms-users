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
  password: string = ''
  email: string = ''
  document: string = ''
  role: UserRoles = UserRoles.USER

  static create (id: ObjectId, data: CreateUserData & BaseEntityData): User {
    const user = new User()
    user.id = id
    user.document = data.document
    user.password = data.password
    user.email = data.email
    user.username = data.username

    if (data.createdAt) user.createdAt = data.createdAt
    if (data.deletedAt) user.deletedAt = data.deletedAt
    if (data.updatedAt) user.updatedAt = data.updatedAt

    return user
  }

  update (dataToUpdate: CreateUserData): User {
    this.password = dataToUpdate.password
    this.document = dataToUpdate.document
    this.email = dataToUpdate.email
    this.username = dataToUpdate.username
    this.role = dataToUpdate.role
    this.updatedAt = new Date()
    return this
  }

  toObject () {
    return {
      _id: this.id,
      username: this.username,
      email: this.email,
      document: this.document,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
