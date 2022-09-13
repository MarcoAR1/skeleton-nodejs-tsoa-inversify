import { BadRequestError } from '../errors/BadRequestError'

export const NotNull = () => (target: object, key: string) => {
  const description = Object.getOwnPropertyDescriptor(target, key)
  Object.defineProperty(target, key, {
    set<T>(value: T) {
      if (value === undefined || value === null) throw new BadRequestError(`Nulleable ${key}`)
      description?.set
        ? description?.set(value)
        : Reflect.defineProperty(target, key, {
            get() {
              return value
            },
            enumerable: true
          })
    },
    configurable: true,
    enumerable: true
  })
}
