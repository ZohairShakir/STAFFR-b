import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const wsOrigins = (process.env.APP_URL || 'http://localhost:3000')
  .split(',')
  .map((u) => u.trim());

@WebSocketGateway({
  cors: {
    origin: wsOrigins.length === 1 ? wsOrigins[0] : wsOrigins,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Authenticate user in WS connection handshake
  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      const cookieHeader = client.handshake.headers.cookie;

      let token = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else if (cookieHeader) {
        // Parse cookies manually
        const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, c: string) => {
          const [key, val] = c.trim().split('=');
          acc[key] = val;
          return acc;
        }, {} as Record<string, string>);
        token = cookies['access_token'];
      }

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Attach user information to socket client object
      client.data = { userId: payload.sub, role: payload.role };
    } catch (err: any) {
      console.warn('WS Handshake authentication failed:', err.message || err);
      client.disconnect();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(_client: Socket) {
    // Graceful disconnect logic
  }

  /**
   * Helper to broadcast websocket events to all connected clients
   */
  emitEvent(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    }
  }
}
