import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { IUser, ISerializedUser } from '../../domain/user/structures'
import { ObjectId } from 'bson'
import { inject, injectable } from 'tsyringe'
import { Db } from 'mongodb'

@injectable()
export class UserRepository extends MongodbRepository<IUser, ISerializedUser> {
  static collection = 'users'
  constructor (@inject('MongodbConnection') connection: Db) {
    super(connection.collection(UserRepository.collection))
  }

  serialize (entity: IUser) {
    return {
      _id: entity.id,
      username: entity.username,
      name: {
        first: entity.name.first,
        last: entity.name.last,
      },
      email: entity.email,
      picture: entity.picture,
      socialNetworks:{
          facebook: entity.socialNetworks.facebook,
          linkedin: entity.socialNetworks.linkedin,
          twitter: entity.socialNetworks.twitter,
          medium: entity.socialNetworks.medium,
          speakerDeck: entity.socialNetworks.speakerDeck,
          pinterest: entity.socialNetworks.pinterest,
          instagram: entity.socialNetworks.instagram,
          others: entity.socialNetworks.others
      },
      location: {
          coutry: entity.location.coutry,
          state: entity.location.state,
          city: entity.location.city
      },
      document: entity.document,
      groups: entity.groups,
      tags: entity.tags,
      services: entity.services,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    }
  }

  deserialize (data: ISerializedUser) {
    return {
      id: data._id,
      username: data.username,
      name: {
        first: data.name.first,
        last: data.name.last,
      },
      email: data.email,
      picture: data.picture,
      socialNetworks:{
          facebook: data.socialNetworks.facebook,
          linkedin: data.socialNetworks.linkedin,
          twitter: data.socialNetworks.twitter,
          medium: data.socialNetworks.medium,
          speakerDeck: data.socialNetworks.speakerDeck,
          pinterest: data.socialNetworks.pinterest,
          instagram: data.socialNetworks.instagram,
          others: data.socialNetworks.others
      },
      location: {
          coutry: data.location.coutry,
          state: data.location.state,
          city: data.location.city
      },
      document: data.document,
      groups: data.groups,
      tags: data.tags,
      services: data.services,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt
    }
  }

  async existsByDocument (document: string): Promise<boolean> {
    return this.existsBy({ document: document, deletedAt: null })
  }

  async delete (id: string | ObjectId): Promise<boolean | null> {
    return this.deleteById(id)
  }

  async getAll (): Promise<PaginatedQueryResult<IUser>> {
    return this.runPaginatedQuery({ deletedAt: null })
  }
}
