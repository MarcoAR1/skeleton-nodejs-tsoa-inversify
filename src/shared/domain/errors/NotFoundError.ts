import httpStatus from 'http-status'
import { BaseError } from './BaseError'

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, httpStatus.NOT_FOUND, NotFoundError.name)
  }
}
