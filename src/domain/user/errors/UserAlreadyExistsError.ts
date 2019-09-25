import { DomainError } from '../../domain.error'

export class UserAlreadyExistsError extends DomainError {
  constructor (document: string) {
    super(`User with document ${document} already exists`)
  }
}
