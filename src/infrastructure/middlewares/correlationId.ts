import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import httpContext from 'express-http-context'
import { Logger } from '../ioc/logger/Logger'

const HEALT_PATH = '/health/status'
export const correlationHeader = 'X-San-CorrelationId'
export const correleationIdKey = 'correlationId'
const correlationId = (request: Request, response: Response, next: NextFunction): void => {
  let currentId = request.headers[correlationHeader] || ''
  if (request.path !== HEALT_PATH && !currentId) {
    const processId = uuidv4()
    request.headers[correlationHeader] = processId
    currentId = processId
    new Logger().info(`Create new correlationId: ${processId}`, null)
  }

  response.setHeader(correlationHeader, currentId)
  httpContext.set(correleationIdKey, currentId)
  next()
}

export default correlationId
