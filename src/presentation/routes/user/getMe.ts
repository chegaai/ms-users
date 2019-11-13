import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'

export function factory (service: UserService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const userId = (req as any).onBehalfOf
      const user = await service.find(userId)

      res.status(200)
        .json(user.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserNotFoundError) return next(boom.notFound(err.message, { code: 'user_not_found' }))

      next(err)
    }
  ]
}

export default { factory }
