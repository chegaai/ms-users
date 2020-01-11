import rescue from 'express-rescue'
import { IExpressoRequest } from '@expresso/app'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'

export function factory (service: UserService) {
  return [
    rescue(async (req: IExpressoRequest, res: Response) => {
      const userId = req.onBehalfOf
      await service.delete(userId as string)

      res.status(204).end()
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      next(err)
    }
  ]
}

export default { factory }
