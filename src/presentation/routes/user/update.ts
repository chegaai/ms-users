import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserNotFoundError } from '../../../domain/user/errors/UserNotFoundError';

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        name: { 
          type: 'object', 
          properties: {
            first: { type: 'string' },
            last: { type: 'string' },
          }
        },
        email: { type: 'string' },
        picture: { type: 'string' },
        socialNetworks: { 
          type: 'object',
          properties: {
            facebook: { type: 'string' },
            linkedin: { type: 'string' },
            twitter: { type: 'string' },
            medium: { type: 'string' },
            speakerDeck: { type: 'string' },
            pinterest: { type: 'string' },
            instagram: { type: 'string' },
            others: { 
              type: 'array',
              items: {
                type: 'object',
                properties:{
                  name: { type: 'string' },
                  link: { type: 'string' }
                }
              } 
            },
          }
        },
        location: {
          type: 'object',
          properties: {
            coutry: { type: 'string' },
            state: { type: 'string' },
            city: { type: 'string'}
          }
        },
        tags: {
          type: 'array',
          items:{
            type: 'string'
          }
        },
        document: { type: 'string' }
      },
      required: ['name', 'email', 'location', 'document', 'tags'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      const userData = req.body
      const userId = req.params.userId
      const user = await service.update(userId, userData)

      res.status(200)
        .json(user)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserNotFoundError) return next(boom.notFound(err.message, { code: 'user_not_found' }))

      next(err)
    }
  ]
}
