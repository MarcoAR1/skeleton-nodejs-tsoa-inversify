import { Connection, connection, connect } from 'mongoose'

export class DataAccess {
  static mongooseInstance: Connection
  static mongooseConnection: Connection

  constructor() {
    DataAccess.connect()
  }

  static async connect(): Promise<Connection> {
    const MONGO_URI = process.env.MONGO_URI
    if (!MONGO_URI) throw new Error('You must provide a MongoDB connection string')
    if (this.mongooseInstance) return this.mongooseInstance

    this.mongooseConnection = connection
    this.mongooseConnection.once('open', () => {
      console.log('MongoDB connected.')
    })

    this.mongooseInstance = (await connect(MONGO_URI)) as unknown as Connection
    return this.mongooseInstance
  }
}
