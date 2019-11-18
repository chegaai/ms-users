import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../../../services/UserService'
import { UserAlreadyExistsError } from '../../../domain/user/errors/UserAlreadyExistsError'
import { InvalidUserError } from '../../../domain/user/errors/InvalidUserError'

export function factory (service: UserService) {
  return [
    validate({
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            lastName: { type: 'string' },
            picture: { type: 'string' },
            socialNetworks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  link: { type: 'string' }
                },
                required: [ 'link', 'name' ]
              }
            },
            location: {
              type: 'object',
              properties: {
                country: { type: 'string' },
                state: { type: 'string' },
                city: { type: 'string' }
              },
              required: [ 'city', 'country', 'state' ]
            },
            language: { type: 'string' },
            groups: {
              type: 'array',
              items: { type: 'string' }
            },
            tags: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: [
            'language',
            'lastName',
            'location',
            'name'
          ]
        },
        user: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' },
            document: { type: 'string' }
          },
          required: ['username', 'password', 'email', 'document'],
          additionalProperties: false
        }
      },
      required: ['user', 'profile']
    }),
    rescue(async (req: Request, res: Response) => {
      const { user: userData, profile: profileData } = req.body
      const { user, profile } = await service.create(userData, profileData)

      res.status(201)
        .json({
          user: user.toObject(),
          profile: profile
        })
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof UserAlreadyExistsError) return next(boom.conflict(err.message, { code: 'user_already_exists' }))
      if (err instanceof InvalidUserError) return next(boom.badData(err.message, { code: 'invalid_user' }))

      next(err)
    }
  ]
}

export default { factory }
