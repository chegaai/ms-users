import axios, { AxiosInstance } from 'axios'
import { injectable, inject } from 'tsyringe'
import { Template } from './mail-templates/Template'
import { IClientConfig } from './structures/interfaces/IClientConfig'
import { UnresponsiveServiceError } from './errors/UnresponsiveServiceError'

@injectable()
export class MailClient {
  baseUrl: string
  http: AxiosInstance

  constructor (@inject('MailClientConfig') { url, timeout }: IClientConfig) {
    this.baseUrl = url
    this.http = axios.create({
      baseURL: url,
      timeout
    })
  }

  /**
   * Calls ms-email to mail the given template and data to the given destination address
   * @param subject Email subject
   * @param to Email destination address
   * @param template Template that should be used by the email microservice to populate the message's body
   */
  async send (subject: string, to: string, template: Template) {
    const payload = {
      subject,
      to: [to],
      template: await template.getContent(),
      data: template.getData()
    }

    await this.http.post('/send', payload)
      .catch(err => {
        if (!err.response) throw new UnresponsiveServiceError(`Unresponsive service: "${this.baseUrl}/send"`)

        throw new Error(err.response.data.error.message)
      })
  }
}
