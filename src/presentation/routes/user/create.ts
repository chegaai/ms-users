import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserAlreadyExistsError } from '../../../domain/user/errors/UserAlreadyExistsError'
import { InvalidUserError } from '../../../domain/user/errors/InvalidUserError'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        document: { type: 'string' }
      },
      required: ['username', 'password', 'email', 'document'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const userData = req.body
      const user = await service.create(userData)

      res.status(201)
        .json(user)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserAlreadyExistsError) return next(boom.conflict(err.message, { code: 'user_already_exists' }))
      if (err instanceof InvalidUserError) return next(boom.badData(err.message, { code: 'invalid_user' }))

      next(err)
    }
  ]
}
