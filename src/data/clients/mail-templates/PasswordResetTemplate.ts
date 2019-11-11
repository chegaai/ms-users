import { Template } from './Template'

export class PasswordResetTemplate extends Template {
  constructor (
    public readonly token: string
  ) {
    super('password-reset')
  }

  getData () {
    return {
      link: `https://chega.ai/password-reset?token=${encodeURIComponent(this.token)}`
    }
  }
}
