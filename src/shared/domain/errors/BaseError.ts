export class BaseError implements Error {
  public message: string
  public code: number
  public name: string

  constructor(messsage: string, code: number, name: string) {
    this.message = messsage
    this.code = code
    this.name = name
  }
}
