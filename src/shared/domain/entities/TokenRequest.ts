import { NotNull } from '../decorators/notNullDecorator'
import { Token } from '../valueObject/Token'
import { ITokenRequest } from './ITokenRequest'

export class TokenRequest implements ITokenRequest {
  @NotNull()
  private token: Token
  constructor(token: string) {
    this.token = Token.create(token)
  }
  getToken() {
    return this.token
  }
}
