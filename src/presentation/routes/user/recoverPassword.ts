import { UserService } from '../../../services/UserService'
import { validate } from '@expresso/validator'
import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { InvalidTokenError } from '../../../services/errors/InvalidTokenError'
import { boom } from '@expresso/errors'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        password: { type: 'string' },
        token: { type: 'string', pattern: '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$' }
      },
      required: ['password', 'token'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const { token, password } = req.body

      await service.recoverPassword(token, password)

      res.status(201)
        .end()
    }),
    (err: Error, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof InvalidTokenError) {
        console.error(err.message)

        return next(boom.unauthorized('invalid token'))
      }

      if (err instanceof UserNotFoundError) {
        return next(boom.notFound(err.message, { code: 'user-not-found' }))
      }

      next(err)
    }
  ]
}

export default { factory }
