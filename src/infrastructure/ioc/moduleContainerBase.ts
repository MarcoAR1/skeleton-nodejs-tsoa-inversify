import { Container } from 'inversify'
export interface ModuleContainerBase {
  run(container: Container): void
}
