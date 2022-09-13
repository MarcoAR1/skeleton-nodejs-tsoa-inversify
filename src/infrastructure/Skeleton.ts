import { Server } from './server'

export class Skeleton {
  server?: Server

  async start() {
    const port = process.env.PORT || '8080'
    this.server = new Server(port)
    return this.server.listen()
  }

  async stop() {
    return this.server?.stop()
  }
}
