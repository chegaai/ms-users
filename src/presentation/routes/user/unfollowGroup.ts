import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { validate } from '@expresso/validator'
import boom from 'boom'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError'
import { GroupNotFoundError } from '../../../domain/user/errors/GroupNotFoundError'

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
      // @TODO: Get userId from JWT token
      const user = await service.unfollowGroup(req.params.userId, req.body.groupId)

      res.status(200)
        .json(user)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserNotFoundError) return next(boom.notFound(err.message, { code: 'user_not_found' }))
      if (err instanceof GroupNotFoundError) return next(boom.notFound(err.message, { code: 'group_not_found' }))
      if (err instanceof TypeError) return next(boom.badRequest(err.message, { code: 'invalid_group_id' }))

      next(err)
    }
  ]
}
