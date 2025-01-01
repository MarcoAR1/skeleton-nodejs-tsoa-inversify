import { ModuleContainerBase } from '../../../infrastructure/ioc/moduleContainerBase'
import '../entrypoint/ChatController'
import '../entrypoint/chat.gateway'

export class ChatModule implements ModuleContainerBase {
  run() {
    // Register any chat-specific dependencies here if needed
    return
  }
}
