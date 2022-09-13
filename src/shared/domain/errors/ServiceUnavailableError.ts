import httpStatus from 'http-status'
import { BaseError } from './BaseError'

export class ServiceUnavailableError extends BaseError {
  constructor(message: string) {
    super(message, httpStatus.SERVICE_UNAVAILABLE, ServiceUnavailableError.name)
  }
}
