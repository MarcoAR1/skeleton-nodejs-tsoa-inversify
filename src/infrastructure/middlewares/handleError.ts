import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ValidateError } from 'tsoa'
import { BadRequestError } from '../../shared/domain/errors/BadRequestError'
import { InternalServerError } from '../../shared/domain/errors/InternalServerError'
import { NotFoundError } from '../../shared/domain/errors/NotFoundError'
import { ServiceUnavailableError } from '../../shared/domain/errors/ServiceUnavailableError'
import { UnauthorizedError } from '../../shared/domain/errors/UnauthorizedError'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
  console.error(err)
  console.error(err.name)
  if (err instanceof JsonWebTokenError)
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Token missing or invalid.' })
  if (err instanceof TokenExpiredError) return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Token expired.' })
  if (err instanceof BadRequestError) return res.status(httpStatus.BAD_REQUEST).json(err)
  if (err instanceof NotFoundError) return res.status(httpStatus.NOT_FOUND).json(err)
  if (err instanceof UnauthorizedError) return res.status(httpStatus.UNAUTHORIZED).json(err)
  if (err instanceof ValidateError) return res.status(httpStatus.BAD_REQUEST).json(err)
  if (err instanceof ServiceUnavailableError) return res.status(httpStatus.SERVICE_UNAVAILABLE).json(err)
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new InternalServerError(err.message))
}

export default handleError
