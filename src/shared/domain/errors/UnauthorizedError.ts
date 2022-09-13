import httpStatus from 'http-status'
import { BaseError } from './BaseError'

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, httpStatus.UNAUTHORIZED, UnauthorizedError.name)
  }
}
