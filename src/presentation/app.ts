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

  const services = container.resolve(Services)

  app.get('/:userId', routes.find(services.user))
  app.get('/', routes.listAll(services.user))
  app.post('/', routes.create(services.user))
  app.put('/:userId', routes.update(services.user))
  app.delete('/:userId', routes.remove(services.user))

  app.use(errors(environment))
})
