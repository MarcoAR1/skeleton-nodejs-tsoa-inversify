import { Controller, Route, Get, Tags, Security } from 'tsoa'
import { HealthStatus } from '../domain/HealthStatus'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
@Tags('health status')
@Route('/health')
export class HealthController extends Controller {
  constructor() {
    super()
  }

  @Get('/status')
  public async checkStatus() {
    return new HealthStatus()
  }

  @Security('api_key')
  @Get('/health')
  public async checkHealth() {
    return new HealthStatus()
  }
}
