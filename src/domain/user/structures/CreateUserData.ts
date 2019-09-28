import { UserRoles, SocialNetworkObject } from '../User'
import { ObjectId } from 'bson'

export interface CreateUserData {
  username: string
  name: string
  password: string
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
  groups?: (string | ObjectId)[]
  tags: string[]
  role: UserRoles
}
