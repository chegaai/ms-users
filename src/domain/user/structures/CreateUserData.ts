import { UserRoles } from '../User'

export interface CreateUserData {
  username: string
  password: string
  email: string
  document: string
  role: UserRoles
}
