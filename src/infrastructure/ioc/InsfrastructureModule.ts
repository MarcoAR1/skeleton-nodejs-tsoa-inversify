import { Container } from 'inversify'
import { IHttpClientBase, HttpClientBase } from './httpClients/httpClientBase'
import { ILogger, Logger } from './logger/Logger'
import { ModuleContainerBase } from './moduleContainerBase'
import { TYPES } from './Type'

export class InsfrastructureModule implements ModuleContainerBase {
  run(container: Container): void {
    container.bind<IHttpClientBase>(TYPES.HttpClientCore).to(HttpClientBase).inSingletonScope()
    container.bind<ILogger>(TYPES.ILogger).to(Logger).inSingletonScope()
  }
}
