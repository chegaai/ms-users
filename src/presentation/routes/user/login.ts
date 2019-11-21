import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import { InvalidLoginError } from '../../../domain/user/errors/InvalidLoginError'

let start: number

function wrapNext (fn: Function) {
  const left = 2000 - (Date.now() - start)

  setTimeout(fn, left)
}

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
      required: ['password', 'handle'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      start = Date.now()
      const { password, handle } = req.body
      const token = await service.authenticate(handle, password)

      res.status(200)
        .json({ token })
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      console.error(err.message)
      if (err instanceof UserNotFoundError || err instanceof InvalidLoginError) return wrapNext(() => next(boom.unauthorized("invalid handle or password")))

      wrapNext(() => next(err))
    }
  ]
}

export default { factory }
