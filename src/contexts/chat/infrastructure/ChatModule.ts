import { Container } from 'inversify'
import { interfaces, TYPE } from 'inversify-socket-utils'
import { ModuleContainerBase } from '../../../infrastructure/ioc/moduleContainerBase'
import { ChatGetwayController } from '../entrypoint/chat.geteway'

export class ChatModule implements ModuleContainerBase {
  run(contianer: Container) {
    contianer.bind<interfaces.Controller>(TYPE.Controller).to(ChatGetwayController)
  }
}
