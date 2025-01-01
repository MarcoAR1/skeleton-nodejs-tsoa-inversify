import { FilterQuery, UpdateQuery } from 'mongoose'

export interface IRead<T> {
  retrieve: (filter: FilterQuery<T>) => void
  findById: (id: string) => void
}

export interface IWrite<T> {
  create: (item: T) => void
  update: (_id: string, item: UpdateQuery<T>) => void
  delete: (_id: string) => void
}
