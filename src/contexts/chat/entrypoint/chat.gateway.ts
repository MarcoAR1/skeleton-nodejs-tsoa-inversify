import { Socket } from 'socket.io'
import { injectable } from 'tsyringe'
import { connectedSocket, controller, onConnect, onDisconnect, onMessage } from '../../../decorators/socket.decorators'

interface ChatMessage {
  userId: string
  message: string
  timestamp: Date
}

@injectable()
@controller('/chat')
export class ChatGateway {
  private readonly connectedClients: Map<string, Socket> = new Map()

  @onConnect()
  handleConnection(@connectedSocket() socket: Socket): void {
    this.connectedClients.set(socket.id, socket)
    console.log('Client connected:', socket.id)

    // Send welcome message to connected client
    socket.emit('welcome', {
      message: `Welcome! Your ID is ${socket.id}`,
      timestamp: new Date()
    })
  }

  @onMessage('send_message')
  handleMessage(@connectedSocket() socket: Socket, payload: ChatMessage): void {
    const messageWithTimestamp = {
      ...payload,
      timestamp: new Date(),
      socketId: socket.id
    }

    // Broadcast to all clients except sender
    socket.broadcast.emit('new_message', messageWithTimestamp)

    // Confirm receipt to sender
    socket.emit('message_sent', {
      status: 'delivered',
      message: messageWithTimestamp
    })
  }

  @onDisconnect()
  handleDisconnect(@connectedSocket() socket: Socket): void {
    this.connectedClients.delete(socket.id)
    console.log('Client disconnected:', socket.id)

    // Notify other clients about disconnection
    socket.broadcast.emit('user_disconnected', {
      userId: socket.id,
      timestamp: new Date()
    })
  }
}
