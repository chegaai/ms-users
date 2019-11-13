import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { UserService } from '../../../services/UserService'
import { Request, Response, NextFunction } from 'express'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import e = require('express')

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        username: { type: 'string' }
      },
      required: ['username'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const { username } = req.body

      const user = await service.update((req as any).onBehalfOf, { username })

      res.status(200)
        .json(user.toObject())
    }),
    (err: Error, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserNotFoundError) {
        return next(boom.notFound(err.message, { code: 'user-not-found' }))
      }

      next(err)
    }
  ]
}

export default { factory }
