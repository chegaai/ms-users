import { ObjectId } from 'bson'
import { UserRoles, LocationObject, SocialNetworkObject } from '../User'
import { Nullable } from '../../../utils/Nullable'

export interface SerializedUser {
  _id: ObjectId
  username: string
  name: string
  email: string
  picture: string
  role: UserRoles
  language: string
  socialNetworks: SocialNetworkObject[]
  location: LocationObject
  document: string
  groups: ObjectId[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
