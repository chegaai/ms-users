import { ObjectId } from 'bson'
import { UserRoles } from '../User'
import { Nullable } from '../../../utils/Nullable'

export interface SerializedUser {
  id: ObjectId
  username: string
  name: string
  email: string
  picture: string
  role: UserRoles
  socialNetworks: [{
    name: string
    link: string
  }]
  location: {
    coutry: string
    state: string
    city: string
  }
  document: string
  groups: ObjectId[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
