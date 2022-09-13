import httpContext from 'express-http-context'
import { Request } from 'express'
import { ITokenAccess } from './ITokenAccess'
import { Token } from '../../shared/domain/valueObject/Token'
import { UnauthorizedError } from '../../shared/domain/errors/UnauthorizedError'

interface JwtPayload {
  user: {
    username: string
    roles: string[]
  }
  tokenLogin: ITokenAccess
}

export function expressAuthentication(request: Request, securityName: string, scopes?: string[]) {
  if (securityName === 'jwt') {
    return new Promise<void>((resolve, reject) => {
      const authorization = request.get('authorization')
      const token = Token.createToAuthorization(authorization || '')
      const { user, tokenLogin } = token.verify<JwtPayload>()
      if (!user?.username) return reject(new UnauthorizedError('Token is not valid'))
      if (scopes && !scopes.some(role => new Set(user.roles).has(role)))
        reject(new UnauthorizedError('You are not authorized to access this resource.'))
      httpContext.set('user', user)
      httpContext.set('tokenLogin', tokenLogin)
      return resolve()
    })
  }
  return Promise.resolve()
}
