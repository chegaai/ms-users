import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import tracing from '@expresso/tracing'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'
import { getProfileClient } from '../data/clients/ProfileClient'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)

  container.register('JWTConfig', { useValue: config.jwt })
  container.register('AuthConfig', { useValue: config.auth })
  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('MailClientConfig', { useValue: config.clients.mail })
  container.register('ProfileClient', { useValue: getProfileClient(config.clients.profiles) })

  const services = container.resolve(Services)

  app.use(tracing.factory())

  // Change username
  app.put('/me', routes.update.factory(services.user))

  app.get('/me', routes.getMe.factory(services.user))
  app.delete('/me', routes.removeMe.factory(services.user))
  app.get('/', routes.listAll.factory(services.user))
  app.post('/', routes.create.factory(services.user))
  app.get('/:userId', routes.find.factory(services.user))
  app.delete('/:userId', routes.removeOne.factory(services.user))
  app.get('/:username/availability', routes.usernameAvailability.factory(services.user))

  // Change password
  app.put('/me/password', routes.setPassword.factory(services.user))

  // Password recovery process
  app.post('/password-recovery', routes.requestPasswordRecovery.factory(services.user))
  app.put('/password-recovery', routes.recoverPassword.factory(services.user))

  app.post('/login', routes.login.factory(services.user))

  app.use(errors(environment))
})
