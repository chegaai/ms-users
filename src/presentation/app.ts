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

  app.get('/me', routes.getMe(services.user))
  app.get('/', routes.listAll(services.user))
  app.post('/', routes.create(services.user))
  app.get('/:userId', routes.find(services.user))
  app.delete('/:userId', routes.remove(services.user))

  // Change password
  app.put('/:userId/password', routes.setPassword.factory(services.user))

  // Password recovery process
  app.post('/password-recovery', routes.requestPasswordRecovery.factory(services.user))
  app.put('/password-recovery', routes.recoverPassword.factory(services.user))

  app.post('/login', routes.login(services.user))

  app.use(errors(environment))
})
