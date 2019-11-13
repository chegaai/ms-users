import { ObjectId } from 'bson'
import { UserRoles} from '../User'
import { Nullable } from '../../../utils/Nullable'

export interface SerializedUser {
  _id: ObjectId
  username: string
  email: string
  role: UserRoles
  password: string
  document: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
