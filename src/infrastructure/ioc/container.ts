import 'reflect-metadata'
import { Container, decorate, injectable, inject } from 'inversify'
import { InsfrastructureModule } from './InsfrastructureModule'
import { HealthModule } from '../../contexts/health/infrastructure/HealthModule'
import { buildProviderModule } from 'inversify-binding-decorators'
import { Controller } from 'tsoa'

const iocContainer = new Container()
const modules = [InsfrastructureModule, HealthModule]
decorate(injectable(), Controller)
modules.forEach(module => new module().run(iocContainer))
iocContainer.load(buildProviderModule())
export { inject, iocContainer }
