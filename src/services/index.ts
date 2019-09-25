import { injectable } from 'tsyringe'
import { UserService } from './UserService'

@injectable()
export class Services {
  constructor (
    public readonly user: UserService
  ) { }
}
