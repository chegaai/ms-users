import * as crypto from 'crypto'
import { promisify } from 'util'
import { injectable, inject } from 'tsyringe'

const pbkdf2 = promisify(crypto.pbkdf2)

/**
 * @property salt - Salt to be used when encrypting
 * @property iterations - Iteration count to be used with pbkdf2
 * @property keylen - Passed to pbkdf2
 * @property digest - Passed to pbkdf2
 */
export interface ICryptoInitializationParams {
  salt: string | null
  iterations: number
  keylen: number
  digest: string
}

/**
 * Handles password encryption and validation
 */
@injectable()
export class Crypto {
  private _salt: string | null
  private _iterations: number
  private _keylen: number
  private _digest: string

  /**
   * @param config Crypto configuration
   */
  constructor (@inject('AuthConfig') { salt, iterations, keylen, digest }: ICryptoInitializationParams) {
    this._salt = salt
    this._iterations = iterations
    this._keylen = keylen
    this._digest = digest
  }

  get salt () {
    return this._salt || crypto.randomBytes(32).toString('base64')
  }

  /**
   * Encrypts a password using PBKDF2
   * Data encrypted with this cannot be decrypted
   * @param password - Password to be encrypted
   * @returns The encrypted password
   */
  async encrypt (password: string, givenSalt?: string): Promise<string> {
    const salt = givenSalt || this.salt
    return pbkdf2(password, salt, this._iterations, this._keylen, this._digest)
      .then(hash => hash.toString('hex'))
      .then(hash => givenSalt ? hash : `${hash}.${salt}`)
  }

  /**
   * Verifies a password against a hash
   * @param password - Password to be verified
   * @param hash - Encrypted password to verify against
   * @returns true if both passswords match false otherwise
   */
  async verify (password: string, hashedValue: string): Promise<boolean> {
    const [hash, salt] = hashedValue.split('.')
    return (await this.encrypt(password, salt)) === hash
  }
}
