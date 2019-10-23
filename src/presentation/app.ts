import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)
  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('AuthConfig', { useValue: config.auth })
  container.register('JWTConfig', { useValue: config.jwt })
  container.register('GroupServiceConnection', { useValue: config.microServices.group })

  const services = container.resolve(Services)

  app.get('/:userId', routes.find(services.user))
  app.get('/', routes.listAll(services.user))
  app.post('/', routes.create(services.user))
  app.post('/login', routes.login(services.user))
  app.put('/:userId', routes.update(services.user))
  app.delete('/:userId', routes.remove(services.user))
  // @TODO: Remove :userId from route and substitute by JWT token
  app.put('/:userId/followed-groups', routes.followGroup(services.user))

  app.use(errors(environment))
})
