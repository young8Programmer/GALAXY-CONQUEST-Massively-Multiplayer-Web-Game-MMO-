import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      this.connectedUsers.set(client.id, userId);
      await this.usersService.updateLastActive(userId);

      client.join(`user:${userId}`);
      client.emit('connected', { userId });

      console.log(`✅ User ${userId} connected (socket: ${client.id})`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`❌ User ${userId} disconnected (socket: ${client.id})`);
    }
  }

  @SubscribeMessage('join_planet')
  handleJoinPlanet(@ConnectedSocket() client: Socket, @MessageBody() data: { planetId: string }) {
    client.join(`planet:${data.planetId}`);
  }

  @SubscribeMessage('leave_planet')
  handleLeavePlanet(@ConnectedSocket() client: Socket, @MessageBody() data: { planetId: string }) {
    client.leave(`planet:${data.planetId}`);
  }

  @SubscribeMessage('join_alliance')
  handleJoinAlliance(@ConnectedSocket() client: Socket, @MessageBody() data: { allianceId: string }) {
    client.join(`alliance:${data.allianceId}`);
  }

  // Broadcast methods
  broadcastToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  broadcastToPlanet(planetId: string, event: string, data: any) {
    this.server.to(`planet:${planetId}`).emit(event, data);
  }

  broadcastToAlliance(allianceId: string, event: string, data: any) {
    this.server.to(`alliance:${allianceId}`).emit(event, data);
  }

  broadcastGlobal(event: string, data: any) {
    this.server.emit(event, data);
  }
}
