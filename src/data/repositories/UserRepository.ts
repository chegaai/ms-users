import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { ObjectId } from 'bson'
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
    return entity.toObject()
  }

  deserialize (data: SerializedUser): User {
    const { _id, ...userData } = data
    return User.create(_id, userData)
  }

  async existsByDocument (document: string): Promise<boolean> {
    return this.existsBy({ document: document, deletedAt: null })
  }

  async getAll (): Promise<PaginatedQueryResult<User>> {
    return this.runPaginatedQuery({ deletedAt: null })
  }
}
