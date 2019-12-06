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
  name: 'ms-users',
  server: {
    printOnListening: true,
  },
  database: {
    mongodb: {
      uri: env.get('DATABASE_MONGODB_URI', ''),
      dbName: env.get('DATABASE_MONGODB_DBNAME', 'chegaai'),
      maximumConnectionAttempts: 5,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },
  jwt: {
    secret: env.get('JWT_SECRET', ''),
    audience: env.get('JWT_AUDIENCE', 'chega.ai:gateway'),
    expiration: env.get('JWT_EXPIRATION', '1d'),
    issuer: env.get('JWT_ISSUER', 'chega.ai:ms-users')
  },
  auth: {
    salt: env.get('AUTH_SALT', ''),
    keylen: env.get.int('AUTH_KEYLEN', 64),
    digest: env.get('AUTH_DIGEST', 'sha512'),
    iterations: env.get.int('AUTH_ITERATIONS', 10000)
  },
  microServices: {
    group: {
      url: env.get('MICROSERVICES_GROUP_URL', '')
    }
  },
  clients: {
    mail: {
      url: env.get('CLIENTS_MAIL_URL', 'http://ms-clients:3000'),
      timeout: env.get.int('CLIENTS_MAIL_TIMEOUT', 3000)
    },
    profiles: {
      url: env.get('CLIENTS_PROFILES_URL', 'http://ms-profiles:3000'),
      timeout: env.get.int('CLIENTS_PROFILE_TIMEOUT', 3000)
    }
  }
}
