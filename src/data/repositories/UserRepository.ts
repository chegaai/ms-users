import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { inject, injectable } from 'tsyringe'
import { Db } from 'mongodb'
import { User } from '../../domain/user/User'
import { SerializedUser } from '../../domain/user/structures/SerializedUser'

@injectable()
export class UserRepository extends MongodbRepository<User, SerializedUser> {
  static collection = 'users'
  constructor (@inject('MongodbConnection') connection: Db) {
    super(connection.collection(UserRepository.collection))
  }

  serialize (entity: User): SerializedUser {
    const { id, ...data } = entity
    return { _id: id, ...data }
  }

  deserialize (data: SerializedUser): User {
    const { _id, ...userData } = data
    return User.create(_id, userData)
  }

  async existsByDocument (document: string): Promise<boolean> {
    return this.existsBy({ document, deletedAt: null })
  }

  async existsByEmail (email: string): Promise<boolean> {
    return this.existsBy({ email, deletedAt: null })
  }

  async existsByUsername (username: string): Promise<boolean> {
    return this.existsBy({ username, deletedAt: null })
  }

  async findByEmail (email: string): Promise<User | null> {
    return this.findOneBy({ email })
  }

  async findByHandle (handle: string) {
    return this.findOneBy({ $or: [{ username: handle }, { email: handle }], deletedAt: null })
  }

  async getAll (page: number, size: number): Promise<PaginatedQueryResult<User>> {
    return this.runPaginatedQuery({ deletedAt: null }, page, size)
  }
}
