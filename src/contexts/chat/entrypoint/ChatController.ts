import { Controller, Get, Route, Tags, Request } from 'tsoa'
import { injectable, singleton } from 'tsyringe'
import * as express from 'express'

@injectable()
@singleton()
@Tags('chat')
@Route('/chat')
export class ChatController extends Controller {
  constructor() {
    super()
  }

  @Get('/')
  public async getChat(@Request() request: express.Request) {
    const response = (<any>request).res as express.Response
    this.setStatus(200)
    response.contentType('text/html')
    response
      .send(
        `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chat Test</title>
            <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
        </head>
        <body>
            <div id="messages"></div>
            <input type="text" id="messageInput" />
            <button onclick="sendMessage()">Send</button>
  
            <script>
                const socket = io('/chat');
                
                socket.on('connect', () => {
                    console.log('Connected to server');
                });
  
                socket.on('welcome', (data) => {
                    addMessage(\`Server: \${data.message}\`);
                });
  
                socket.on('new_message', (data) => {
                    addMessage(\`User \${data.socketId}: \${data.message}\`);
                });
  
                socket.on('message_sent', (data) => {
                    addMessage(\`Message delivered: \${data.message.message}\`);
                });
  
                socket.on('user_disconnected', (data) => {
                    addMessage(\`User \${data.userId} disconnected\`);
                });
  
                function sendMessage() {
                    const message = document.getElementById('messageInput').value;
                    socket.emit('send_message', {
                        userId: socket.id,
                        message: message,
                        timestamp: new Date()
                    });
                    document.getElementById('messageInput').value = '';
                }
  
                function addMessage(message) {
                    const messagesDiv = document.getElementById('messages');
                    messagesDiv.innerHTML += \`<div>\${message}</div>\`;
                }
            </script>
        </body>
        </html>
      `
      )
      .end()
  }
}
