import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import { InvalidPasswordError } from '../../../services/errors/InvalidPasswordError'
import { IExpressoRequest } from '@expresso/app'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        newPassword: { type: 'string' },
        oldPassword: { type: 'string' }
      },
      required: ['newPassword', 'oldPassword'],
      additionalProperties: false
    }),
    rescue(async (req: IExpressoRequest<Record<string, string>>, res: Response) => {
      const userId = req.onBehalfOf as string
      const { oldPassword, newPassword } = req.body

      await service.setPassword(userId, oldPassword, newPassword)

      res.status(200)
        .end()
    }),
    (err: Error, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof InvalidPasswordError) {
        console.error(err.message)

        return next(boom.unauthorized('invalid password'))
      }

      if (err instanceof UserNotFoundError) {
        return next(boom.notFound(err.message, { code: 'user-not-found' }))
      }

      next(err)
    }
  ]
}

export default { factory }
