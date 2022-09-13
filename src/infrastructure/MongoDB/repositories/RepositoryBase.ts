import mongoose, { CallbackError, Document } from 'mongoose'
import { IRead, IWrite } from '../interface'

export class RepositoryBase<T extends Document> implements IRead<T>, IWrite<T> {
  private _model: mongoose.Model<Document>

  constructor(schemaModel: mongoose.Model<Document>) {
    this._model = schemaModel
  }

  create(item: T, callback: (error: CallbackError, result: Document) => void) {
    this._model.create(item, callback)
  }

  retrieve(callback: (error: CallbackError, result: Document) => void) {
    this._model.find({}, callback)
  }

  update(_id: mongoose.Types.ObjectId, item: T, callback: (error: CallbackError, result: Document) => void) {
    this._model.update({ _id: _id }, item, callback)
  }

  delete(_id: string, callback: (error: CallbackError, result: Document | null) => void) {
    this._model.remove({ _id: this.toObjectId(_id) }, err => callback(err, null))
  }

  findById(_id: string, callback: (error: CallbackError, result: T) => void) {
    this._model.findById(_id, callback)
  }

  toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id) as mongoose.Types.ObjectId
  }
}
