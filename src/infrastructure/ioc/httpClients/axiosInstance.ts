import axios, { AxiosInstance } from 'axios'
import httpStatus from 'http-status'
import { BadRequestError } from '../../../shared/domain/errors/BadRequestError'
import { NotFoundError } from '../../../shared/domain/errors/NotFoundError'
import { UnauthorizedError } from '../../../shared/domain/errors/UnauthorizedError'
import https from 'https'
import { Logger } from '../logger/Logger'
import { ServiceUnavailableError } from '../../../shared/domain/errors/ServiceUnavailableError'

const logger = new Logger()

export const axiosInstance: AxiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

axiosInstance.interceptors.response.use(
  response => {
    logger.info(`Comunicación exitosa con el servicio ${response.config.url}`, response.data)
    return response
  },
  res => {
    const { data, message: messageToResponse, status, config, url } = res.toJSON ? res.toJSON() : res
    logger.error(`Error ${status} al comunicarse con el servicio ${url || config?.url}`, null, data || config?.data)
    const message = messageToResponse || data || `Error ${status} al comunicarse con el servicio`
    if (status === httpStatus.BAD_REQUEST) throw new BadRequestError(message)
    if (status === httpStatus.NOT_FOUND) throw new NotFoundError(message)
    if (status === httpStatus.UNAUTHORIZED) throw new UnauthorizedError(message)
    throw new ServiceUnavailableError(message)
  }
)
