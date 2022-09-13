/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import winston from 'winston'
import httpContext from 'express-http-context'
import { injectable } from 'inversify'

const enumerateErrorFormat = winston.format(info => {
  const transformed: winston.Logform.TransformableInfo = {
    level: '',
    message: undefined
  }
  info.meta = info.meta ? info.meta : {}
  transformed.message = info.message
  transformed.level = info.level
  transformed['x-san-correlationid'] = httpContext.get('correlationId')
  if (info.meta) transformed.fields = info.meta
  if (info.error)
    transformed.error = info.error.stack !== null && info.error.stack !== undefined ? info.error.stack : info.error
  return transformed
})

const log = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        enumerateErrorFormat(),
        winston.format.json()
      )
    })
  ]
})

export interface ILogger {
  error: (messsage: any, error?: any, meta?: any) => void
  info: (message: any, meta?: any) => void
  verbose: (message: any, meta?: any) => void
  debug: (message: any, meta?: any) => void
  warn: (message: any, meta?: any) => void
}

@injectable()
export class Logger implements ILogger {
  error(messsage: string, error?: any, meta?: any) {
    log.error(messsage, { error, meta })
  }
  info(message: any, meta?: any) {
    log.info(message, meta)
  }
  verbose(message: string, meta?: any) {
    log.verbose(message, meta)
  }
  debug(message: string, meta?: any) {
    log.debug(message, meta)
  }
  warn(message: string, meta?: any) {
    log.warn(message, meta)
  }
}
