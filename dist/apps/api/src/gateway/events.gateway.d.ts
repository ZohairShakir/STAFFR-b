import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): any;
    handleDisconnect(_client: Socket): void;
    /**
     * Helper to broadcast websocket events to all connected clients
     */
    emitEvent(event: string, data: any): void;
}
//# sourceMappingURL=events.gateway.d.ts.map