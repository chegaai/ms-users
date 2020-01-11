import { IExpressoRequest } from '@expresso/app'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { NextFunction, Request, Response } from 'express'
import rescue from 'express-rescue'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import { UserService } from '../../../services/UserService'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        document: { type: 'string' }
      },
      additionalProperties: false
    }),
    rescue(async (req: IExpressoRequest<{ username: string, document: string, email: string }>, res: Response) => {
      const { username, email, document } = req.body

      const userId = req.onBehalfOf as string

      const user = await service.update(userId, { username, email, document })

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
