import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../../infrastructure/env/config'
import { UnauthorizedError } from '../errors/UnauthorizedError'
import { ValueObject } from './ValueObject'

export interface TokenProps {
  value: string
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYTQ0NjExNiIsInJvbGVzIjpbIklWUiIsIlRFU1QiLCJBRE1JTiIsIlNVUEVSQURNSU4iXSwiZW1haWwiOiJtYXJjcml2ZXJvQHNhbnRhbmRlcnRlY25vbG9naWEuY29tLmFyIiwibmFtZSI6Ik1hcmNvIEFudG9uaW8gUml2ZXJvIiwicHJlZmVycmVkVXNlcm5hbWUiOiJhNDQ2MTE2IiwiZ2l2ZW5OYW1lIjoiTWFyY28gQW50b25pbyJ9LCJ0b2tlbkxvZ2luIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJZ09pQWlTbGRVSWl3aWEybGtJaUE2SUNKNWNEWmtNemhGZFVKamFqbHpMWGxyYUVSWVpYRm5VakJPTmpjMGMwVlpkRWhvYm1GV1RHWlBTSGR6SW4wLmV5SmxlSEFpT2pFMk5qSXdNemc1TnpFc0ltbGhkQ0k2TVRZMk1qQXpPRFkzTVN3aVlYVjBhRjkwYVcxbElqb3hOall5TURNNE5qVTFMQ0pxZEdraU9pSTROVGRqTlRsaVlTMW1NRFUxTFRSaFltRXRZVGd5WWkxaFlXUTFaVEkxWlRObE5HWWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwydGxlV05zYjJGckxXOXdaVzV6YUdsbWRDMXlhSE56Ynk1aGNIQnpMbTlqY0M1aGNpNWljMk5vTDJGMWRHZ3ZjbVZoYkcxekwwRmpkR2wyWlVScGNtVmpkRzl5ZVNJc0ltRjFaQ0k2SW1GalkyOTFiblFpTENKemRXSWlPaUkxT1Rjd1pXWmxNaTA1WlRJMUxUUmlOekl0T1RCak9DMDFNbVF6Tm1ZM1pERTVNR0VpTENKMGVYQWlPaUpDWldGeVpYSWlMQ0poZW5BaU9pSmpiM0psTFdsdWRHVnlZV04wYVc5dWN5MWpiR2xsYm5RaUxDSnViMjVqWlNJNkltRm1abVkwTTJRNUxXWmhOMll0TkRKbVlpMWlNR1F5TFdabU1EQXlNbUprWXpFMk5DSXNJbk5sYzNOcGIyNWZjM1JoZEdVaU9pSXlaVEppTWprMU5pMDBOalEyTFRReVlUY3RZV000T1MwNVpUbG1Nak5pTmpCaU5tRWlMQ0poWTNJaU9pSXdJaXdpWVd4c2IzZGxaQzF2Y21sbmFXNXpJanBiSWlvaVhTd2ljbVZoYkcxZllXTmpaWE56SWpwN0luSnZiR1Z6SWpwYkltUmxabUYxYkhRdGNtOXNaWE10WVdOMGFYWmxaR2x5WldOMGIzSjVJaXdpYjJabWJHbHVaVjloWTJObGMzTWlMQ0oxYldGZllYVjBhRzl5YVhwaGRHbHZiaUpkZlN3aWNtVnpiM1Z5WTJWZllXTmpaWE56SWpwN0ltRmpZMjkxYm5RaU9uc2ljbTlzWlhNaU9sc2liV0Z1WVdkbExXRmpZMjkxYm5RaUxDSnRZVzVoWjJVdFlXTmpiM1Z1ZEMxc2FXNXJjeUlzSW5acFpYY3RjSEp2Wm1sc1pTSmRmWDBzSW5OamIzQmxJam9pYjNCbGJtbGtJR1Z0WVdsc0lIQnliMlpwYkdVaUxDSnphV1FpT2lJeVpUSmlNamsxTmkwME5qUTJMVFF5WVRjdFlXTTRPUzA1WlRsbU1qTmlOakJpTm1FaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpYm1GdFpTSTZJazFoY21OdklFRnVkRzl1YVc4Z1VtbDJaWEp2SWl3aWNISmxabVZ5Y21Wa1gzVnpaWEp1WVcxbElqb2lZVFEwTmpFeE5pSXNJbWRwZG1WdVgyNWhiV1VpT2lKTllYSmpieUJCYm5SdmJtbHZJaXdpWm1GdGFXeDVYMjVoYldVaU9pSlNhWFpsY204aUxDSmxiV0ZwYkNJNkltMWhjbU55YVhabGNtOUFjMkZ1ZEdGdVpHVnlkR1ZqYm05c2IyZHBZUzVqYjIwdVlYSWlmUS5XOUFUX08tS3VqTkE4QzRyNHUxeG56Q1V2ZWR2Rm1QdmtnNmNpNE5Qa2NzbWxxbjM5Nm9reW5Sdk1QUXpDWXVfMWo3X3h2V1pFdjljb2ItVlNzWjlPQXNQblRFMmJZTWNGTnFMR0tqVnlIUXVIc09xY29tXzY1Vjk0YmFPQk80WkE0YmxvRFZ2Y2dtQ05nWU1nV19CQzhrdDduZjgzUEF0UWU1UC1sMWJJdHEzVlVEci0tZFNmcU5YeEZOMFlwV1FZeVJfLW1pVTVBQXZSaVVwclR1N3N1ZXFESzQ0aVBfNzUtOFdCMmpYTjRyV1g2bzA4VFZVT0dTeEVCWmVoVkRwNE9TZWhKNnlyaWQ1ZGJNRXJJaVoxREpELWZMakl2b2hmQlU1RktxdF9lSXhuR2hTNFRJR0JkM05TWTNjUGdBRTVwUk1PVE5zUjlPWF8zbVVzNGtocGciLCJpYXQiOjE2NjIwMzg2NzEsImV4cCI6MTY2MjA0MDQ3MX0.aYCOf4wGUr5GRsQUmOfX3TQgP-ThDGsbIPThaBeH85Q
const HALFOFHOUR = 60 * 30
export class Token extends ValueObject<TokenProps> {
  public readonly value: string

  private constructor(props: TokenProps) {
    super(props)
    this.value = props.value
  }

  public static create(token: string): Token {
    if (!token) throw new UnauthorizedError('not valid token')
    return new Token({ value: token })
  }

  public static createToAuthorization(authorization: string): Token {
    const token = authorization?.toLowerCase().startsWith('bearer') && authorization.split(' ')[1]
    if (!token) throw new UnauthorizedError('Missing Bearer token')
    return Token.create(token)
  }

  verify<T>(): T {
    const verify = <T>jwt.verify(this.value, JWT_SECRET)
    return verify
  }

  decode<T>(): T {
    const decode = <T>jwt.decode(this.value)
    return decode
  }

  public static sign<T extends object>(paylaod: T): Token {
    const tokenSign = jwt.sign(paylaod, JWT_SECRET, {
      expiresIn: HALFOFHOUR
    })
    return Token.create(tokenSign)
  }
}
