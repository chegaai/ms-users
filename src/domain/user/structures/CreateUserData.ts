import { ObjectId } from 'bson'
import { UserRoles, SocialNetworkObject } from '../User'

export interface CreateUserData {
  username: string
  name: string
  email: string
  picture: string
  language: string
  socialNetworks: SocialNetworkObject[]
  location: {
    country: string
    state: string
    city: string
  }
  document: string
  groups: ObjectId[]
  tags: string[]
  role: UserRoles
}
