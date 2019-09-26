export class GroupNotFoundError extends Error {
  constructor (groupId: string) {
    super(`Group ${groupId} was not found`)
  }
}
