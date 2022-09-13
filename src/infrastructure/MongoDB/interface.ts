import mongoose, { CallbackError, Document } from 'mongoose'

export interface IRead<T> {
  retrieve: (callback: (error: CallbackError, result: Document) => void) => void
  findById: (id: string, callback: (error: CallbackError, result: T) => void) => void
}

export interface IWrite<T> {
  create: (item: T, callback: (error: CallbackError, result: Document) => void) => void
  update: (_id: mongoose.Types.ObjectId, item: T, callback: (error: CallbackError, result: Document) => void) => void
  delete: (_id: string, callback: (error: CallbackError, result: Document | null) => void) => void
}
