import { DomainError } from '../../domain.error'

export class InvalidUserError extends DomainError {
  constructor () {
    super('Invalid user data')
  }
}
