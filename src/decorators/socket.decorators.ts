/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata'

// Define types for handlers
export type HandlerType = 'connect' | 'disconnect' | 'message'

export interface SocketHandler {
  event: string
  handler: string
  type: HandlerType
}

// Metadata keys
const CONTROLLER_META_KEY = 'socket:controller'
const HANDLERS_META_KEY = 'socket:handlers'
const SOCKET_PARAM_META_KEY = 'socket:connected_socket_param'

// Controller decorator
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function controller(prefix: string = '/'): ClassDecorator {
  return function (target: Function): void {
    Reflect.defineMetadata(CONTROLLER_META_KEY, prefix, target)
  }
}

// Event handler decorators
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function onConnect(event: string = 'connection'): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  return function (target: Object, propertyKey: string | symbol, _: PropertyDescriptor): void {
    const handlers: SocketHandler[] = Reflect.getMetadata(HANDLERS_META_KEY, target.constructor) || []
    handlers.push({
      event,
      handler: propertyKey.toString(),
      type: 'connect'
    })
    Reflect.defineMetadata(HANDLERS_META_KEY, handlers, target.constructor)
  }
}

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function onDisconnect(event: string = 'disconnect'): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Object, propertyKey: string | symbol, _: PropertyDescriptor): void {
    const handlers: SocketHandler[] = Reflect.getMetadata(HANDLERS_META_KEY, target.constructor) || []
    handlers.push({
      event,
      handler: propertyKey.toString(),
      type: 'disconnect'
    })
    Reflect.defineMetadata(HANDLERS_META_KEY, handlers, target.constructor)
  }
}

export function onMessage(event: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, _: PropertyDescriptor): void {
    const handlers: SocketHandler[] = Reflect.getMetadata(HANDLERS_META_KEY, target.constructor) || []
    handlers.push({
      event,
      handler: propertyKey.toString(),
      type: 'message'
    })
    Reflect.defineMetadata(HANDLERS_META_KEY, handlers, target.constructor)
  }
}

// Parameter decorator for socket injection
export function connectedSocket(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number): void => {
    if (propertyKey) {
      Reflect.defineMetadata(SOCKET_PARAM_META_KEY, parameterIndex, target, propertyKey.toString())
    }
  }
}

// Helper function to get metadata
export function getControllerMetadata(target: Function): string {
  return Reflect.getMetadata(CONTROLLER_META_KEY, target)
}

export function getHandlersMetadata(target: Function): SocketHandler[] {
  return Reflect.getMetadata(HANDLERS_META_KEY, target) || []
}

export function getSocketParamIndex(target: Object, propertyKey: string): number {
  return Reflect.getMetadata(SOCKET_PARAM_META_KEY, target, propertyKey)
}
