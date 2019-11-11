import jwt from 'jsonwebtoken'
import { User } from '../domain/user/User'
import { injectable, inject } from 'tsyringe'

/**
 * @property salt - Salt to be used when encrypting
 * @property iterations - Iteration count to be used with pbkdf2
 * @property keylen - Passed to pbkdf2
 * @property digest - Passed to pbkdf2
 */
export interface IJWTInitializationParams {
  secret: string
  audience: string
  expiration: string
}

/**
 * Handles password encryption and validation
 */
@injectable()
export class JWT {
  private readonly secret: string
  private readonly audience: string
  private readonly expiration: string
  private readonly issuer: string = 'urn:chega.ai:issuer'
  private readonly subjectUrn: string = 'urn:chega.ai:user:'

  /**
   * @param config Crypto configuration
   */
  constructor (@inject('JWTConfig') { secret, audience, expiration = '1d' }: IJWTInitializationParams) {
    this.secret = secret
    this.audience = audience
    this.expiration = expiration
  }

  signPayload (payload: any, subject: string, ttl: string) {
    return jwt.sign(payload, this.secret, { audience: this.audience, expiresIn: ttl, issuer: this.issuer, subject })
  }

  signUser (data: User) {
    const { password, id, ...payload } = data
    return jwt.sign(payload, this.secret, { audience: this.audience, expiresIn: this.expiration, issuer: this.issuer, subject: `${this.subjectUrn}:${id}` })
  }

  verify (token: string) {
    return jwt.verify(token, this.secret, { audience: this.audience, issuer: this.issuer })
  }

}
