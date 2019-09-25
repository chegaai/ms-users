import { ObjectId } from 'bson'
import { UserRoles } from '../User'

export interface CreateUserData {
  username: string
  name: string
  email: string
  picture: string
  socialNetworks: [{
    name: string
    link: string
  }]
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
