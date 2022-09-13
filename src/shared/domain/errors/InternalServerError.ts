import httpStatus from 'http-status'
import { BaseError } from './BaseError'

export class InternalServerError extends BaseError {
  constructor(message: string) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, InternalServerError.name)
  }
}
