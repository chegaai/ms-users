import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'

export function factory (service: UserService) {
  return [
    rescue(async (_req: Request, res: Response) => {
      const users = await service.listAll()

      res.status(200)
        .json(users)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      next(err)
    }
  ]
}
