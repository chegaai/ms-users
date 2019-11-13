import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)

  container.register('JWTConfig', { useValue: config.jwt })
  container.register('AuthConfig', { useValue: config.auth })
  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('MailClientConfig', { useValue: config.clients.mail })

  const services = container.resolve(Services)

  // Change username
  app.put('/me', routes.update.factory(services.user))

  app.get('/me', routes.getMe.factory(services.user))
  app.get('/', routes.listAll.factory(services.user))
  app.post('/', routes.create.factory(services.user))
  app.get('/:userId', routes.find.factory(services.user))
  app.delete('/:userId', routes.remove.factory(services.user))

  // Change password
  app.put('/:userId/password', routes.setPassword.factory(services.user))

  // Password recovery process
  app.post('/password-recovery', routes.requestPasswordRecovery.factory(services.user))
  app.put('/password-recovery', routes.recoverPassword.factory(services.user))

  app.post('/login', routes.login.factory(services.user))

  app.use(errors(environment))
})
