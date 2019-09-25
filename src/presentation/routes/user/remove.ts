import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { InvalidUserError } from '../../../domain/user/errors/InvalidUserError'

export function factory (service: UserService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const userId = req.params.userId
      await service.delete(userId)

      res.status(204).end()
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof InvalidUserError) return next(boom.badData(err.message, { code: 'invalid_user_id' }))
      next(err)
    }
  ]
}
