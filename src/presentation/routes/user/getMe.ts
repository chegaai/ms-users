import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import { IExpressoRequest } from '@expresso/app'

export function factory (service: UserService) {
  return [
    rescue(async (req: IExpressoRequest, res: Response) => {
      const userId = req.onBehalfOf
      const user = await service.find(userId as string)

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
