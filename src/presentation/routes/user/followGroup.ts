import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { validate } from '@expresso/validator'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        groupId: { type: 'string' }
      },
      required: ['groupId'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const user = await service.followGroup(req.params.userId, req.body.groupId)

      res.status(200)
        .json(user)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      next(err)
    }
  ]
}
