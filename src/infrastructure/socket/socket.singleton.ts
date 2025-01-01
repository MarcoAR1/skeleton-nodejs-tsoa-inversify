import { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { getControllerMetadata, getHandlersMetadata, getSocketParamIndex } from '../../decorators/socket.decorators'
import { container } from 'tsyringe'

// Export the ControllerClass type
export type ControllerClass = { new (...args: any[]): any }
type ControllerInstance = InstanceType<ControllerClass>

export class SocketSingleton {
  private static instance: SocketSingleton
  private io: SocketServer | null = null

  public static getInstance(): SocketSingleton {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton()
    }
    return SocketSingleton.instance
  }

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: '*'
      }
    })
  }

  public registerControllers(controllers: any[]): void {
    controllers.forEach(controller => {
      const instance = container.resolve(controller)
      const prefix = getControllerMetadata(controller)
      if (!this.io) throw new Error('Socket.IO has not been initialized')
      const namespace = this.io.of(prefix)

      const handlers = getHandlersMetadata(controller)

      namespace.on('connection', socket => {
        handlers.forEach(({ event, handler, type }) => {
          const methodHandler = (instance as ControllerInstance)[handler].bind(instance)
          const paramIndex = getSocketParamIndex(instance as Record<string, unknown>, handler)

          switch (type) {
            case 'connect':
              if (event === 'connection') {
                const args = new Array(paramIndex).fill(undefined)
                args[paramIndex] = socket
                methodHandler(...args)
              }
              break
            case 'disconnect':
              socket.on('disconnect', () => {
                const args = new Array(paramIndex).fill(undefined)
                args[paramIndex] = socket
                methodHandler(...args)
              })
              break
            case 'message':
              socket.on(event, (...payload) => {
                const args = [...payload]
                if (paramIndex !== undefined) {
                  args.splice(paramIndex, 0, socket)
                }
                methodHandler(...args)
              })
              break
          }
        })
      })
    })
  }

  public getIO(): SocketServer {
    if (!this.io) {
      throw new Error('Socket.IO has not been initialized')
    }
    return this.io
  }
}
