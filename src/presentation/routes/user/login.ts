import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import { InvalidLoginError } from '../../../domain/user/errors/InvalidLoginError'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        handle: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      },
      required: ['password', 'username'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const { password, handle } = req.body
      const user = await service.authenticate(handle, password)

      res.status(200)
        .json(user)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserNotFoundError || err instanceof InvalidLoginError) return next(boom.unauthorized(err.message))

      next(err)
    }
  ]
}
