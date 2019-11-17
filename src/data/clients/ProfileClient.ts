import axios, { AxiosInstance, AxiosError } from 'axios'
import { IClientConfig } from './structures/interfaces/IClientConfig'
import { ProfileCreationParams } from './structures/ProfileCreationParams'
import { UnresponsiveServiceError } from './errors/UnresponsiveServiceError'

type CreateFn = (data: ProfileCreationParams) => Promise<void>
type ExistsFn = (email: string) => Promise<boolean>

export type ProfileClient = {
  createProfile: CreateFn,
  exists: ExistsFn
}

export function exists (http: AxiosInstance): ExistsFn {
  return async (email) => {
    return http.get('/availability', { params: { email } })
      .then(({ data }) => !data.available)
      .catch((err: AxiosError) => {
        if (!err.response) throw new UnresponsiveServiceError(`Unresponsive service: "GET /availability at ms-profiles"`)

        throw new Error(err.response.data.error.message)
      })
  }
}

export function createProfile (http: AxiosInstance): CreateFn {
  return async (data) => {
    return http.post('/', data)
      .then(({ data }) => data)
      .catch(err => {
        if (!err.response) throw new UnresponsiveServiceError(`Unresponsive service: "POST / at ms-profiles"`)

        throw new Error(err.response.data.error.message)
      })
  }
}

export function getProfileClient (config: IClientConfig): ProfileClient {
  const http = axios.create({
    baseURL: config.url,
    timeout: config.timeout
  })

  return {
    createProfile: createProfile(http),
    exists: exists(http)
  }
}