import { DomainError } from '../../domain.error'

export class UserAlreadyExistsError extends DomainError {
  constructor (key: string, value: string) {
    super(`User with ${key} "${value}" already exists`)
  }
}
