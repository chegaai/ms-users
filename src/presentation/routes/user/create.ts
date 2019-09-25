import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserAlreadyExistsError } from '../../../domain/user/errors/UserAlreadyExistsError'
import { InvalidUserError } from '../../../domain/user/errors/InvalidUserError';

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        username: { type: 'string' },
        name: {
          type: 'string'
        },
        email: { type: 'string' },
        picture: { type: 'string' },
        socialNetworks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              link: { type: 'string' }
            }
          }
        },
        language: {
          type: 'string'
        },
        location: {
          type: 'object',
          properties: {
            country: { type: 'string' },
            state: { type: 'string' },
            city: { type: 'string' }
          }
        },
        tags: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        document: { type: 'string' }
      },
      required: ['name', 'email', 'location', 'document', 'tags', 'language'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const userData = req.body
      const user = await service.create(userData)

      res.status(201)
        .json(user)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserAlreadyExistsError) return next(boom.conflict(err.message, { code: 'user_already_exists' }))
      if (err instanceof InvalidUserError) return next(boom.badData(err.message, { code: 'invalid_user' }))

      next(err)
    }
  ]
}
