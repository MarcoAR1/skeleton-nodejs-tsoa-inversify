import { Server } from '../../../infrastructure/server'

class TestServer {
  static instance: Server
  static getInstance(): Server {
    if (!TestServer.instance) TestServer.instance = new Server('5005')
    return TestServer.instance
  }
}

export const TestServerInstance = TestServer.getInstance().getServer()
