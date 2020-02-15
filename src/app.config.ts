import env from 'sugar-env'
import { IServerConfig } from '@expresso/server'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'

interface BaseConfig extends IExpressoConfigOptions {
  name: string,
  database: {
    mongodb: IMongoParams
  },
  server?: IServerConfig['server']
}

export type IAppConfig = BaseConfig & typeof config

const APP_NAME = 'ms-users'

export const config = {
  name: APP_NAME,
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
      url: env.get('CLIENTS_MAIL_URL', 'http://zaqar:3000'),
      timeout: env.get.int('CLIENTS_MAIL_TIMEOUT', 3000),
      lang: env.get('ZAQAR_LANG', 'pug'),
    },
    profiles: {
      url: env.get('CLIENTS_PROFILES_URL', 'http://ms-profiles:3000'),
      timeout: env.get.int('CLIENTS_PROFILE_TIMEOUT', 3000)
    }
  }
}
