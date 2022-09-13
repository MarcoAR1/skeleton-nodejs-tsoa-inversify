import httpStatus from 'http-status'
import { BaseError } from './BaseError'

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, httpStatus.BAD_REQUEST, BadRequestError.name)
  }
}
