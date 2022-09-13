import { NotNull } from '../decorators/notNullDecorator'
import { IRequestId } from '../interfaces/IRequestId'

export class IdRequest implements IRequestId {
  @NotNull()
  private id: string
  constructor(id: string) {
    this.id = id
  }
  getId() {
    return this.id
  }
}
