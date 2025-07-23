import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WsGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(userId: string, message: string) {
    this.server.emit(`notify-${userId}`, { message });
  }
}
