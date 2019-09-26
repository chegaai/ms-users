export class InvalidLoginError extends Error {
  constructor () {
    super('Invalid login')
  }
}
