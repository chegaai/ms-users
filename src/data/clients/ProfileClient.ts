import axios, { AxiosInstance } from 'axios'
import { IClientConfig } from './structures/interfaces/IClientConfig'
import { ProfileCreationParams } from './structures/ProfileCreationParams'
import { UnresponsiveServiceError } from './errors/UnresponsiveServiceError'

type CreateFn = (data: ProfileCreationParams) => Promise<void>
type DeleteFn = (id: string) => Promise<void>

export type ProfileClient = {
  createProfile: CreateFn
  delete: DeleteFn
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

export function deleteProfile (http: AxiosInstance): DeleteFn {
  return async (id: string) => {
    return http.delete(`/${id}`)
      .then(({ data }) => data)
      .catch(err => {
        if (!err.response) throw new UnresponsiveServiceError(`Unresponsive service: "DELETE /${id}" at ms-profiles`)

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
    delete: deleteProfile(http)
  }
}
