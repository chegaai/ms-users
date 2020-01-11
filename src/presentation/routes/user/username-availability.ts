import { UserService } from '../../../services/UserService'
import rescue from 'express-rescue'
import { Request, Response } from 'express'

export function factory (service: UserService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const exists = await service.existsByUsername(req.params.username)

      res.status(200)
        .json({ available: !exists })
    })
  ]
}

export default { factory }
