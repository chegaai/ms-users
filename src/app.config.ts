import env from 'sugar-env'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'
import { IServerConfig } from '@expresso/server'

interface BaseConfig extends IExpressoConfigOptions {
  name: string,
  database: {
    mongodb: IMongoParams
  },
  server?: IServerConfig['server']
}

export type IAppConfig = BaseConfig & typeof config

export const config = {
  name: 'ms-user',
  server: {
    printOnListening: true,
  },
  database: {
    mongodb: {
      uri: env.get('DATABASE_MONGODB_URI', ''),
      dbName: env.get('DATABASE_MONGODB_DBNAME', 'chegaai'),
      maximumConnectionAttempts: 5,
      options: {}
    }
  },
  jwt: {
    secret: env.get('JWT_SECRET', ''),
    audience: env.get('JWT_AUDIENCE', 'urn:chega.ai:users'),
    expiration: env.get('JWT_EXPIRATION', '1d')
  },
  auth: {
    salt: env.get('AUTH_SALT', ''),
    keylen: env.get.int('AUTH_KEYLEN', 64),
    digest: env.get('AUTH_DIGEST', 'sha512'),
    iterations: env.get.int('AUTH_ITERATIONS', 10000)
  }
}
