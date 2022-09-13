import { Controller, Route, Get, Tags, Security } from 'tsoa'
import { provideSingleton } from '../../../infrastructure/ioc/provideSingleton'
import { HealthStatus } from '../domain/HealthStatus'

@provideSingleton(HealthController)
@Tags('health status')
@Route('/health')
export class HealthController extends Controller {
  constructor() {
    super()
  }

  @Security('none')
  @Get('/status')
  public async checkStatus() {
    return new HealthStatus()
  }
}
