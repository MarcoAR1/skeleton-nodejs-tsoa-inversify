import { Connection, connection, connect } from 'mongoose'

export let MongoConnection!: Connection

export const GetMongoDbInstance = async () => {
  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) throw new Error('You must provide a MongoDB connection string')

  connection.once('open', () => {
    console.log('MongoDB connected.')
  })
  MongoConnection = (await connect(MONGO_URI)) as unknown as Connection
  return MongoConnection
}
