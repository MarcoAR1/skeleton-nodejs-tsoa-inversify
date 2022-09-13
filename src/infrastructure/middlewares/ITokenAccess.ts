/* eslint-disable @typescript-eslint/naming-convention */
export type ITokenAccess = {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: 'bearer'
  'not-before-policy': number
  session_state: string
  scope: string
}
