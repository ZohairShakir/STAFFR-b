"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let EventsGateway = class EventsGateway {
    jwtService;
    configService;
    server;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    // Authenticate user in WS connection handshake
    async handleConnection(client) {
        try {
            const authHeader = client.handshake.headers.authorization;
            const cookieHeader = client.handshake.headers.cookie;
            let token = null;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
            else if (cookieHeader) {
                // Parse cookies manually
                const cookies = cookieHeader.split(';').reduce((acc, c) => {
                    const [key, val] = c.trim().split('=');
                    acc[key] = val;
                    return acc;
                }, {});
                token = cookies['access_token'];
            }
            if (!token) {
                client.disconnect();
                return;
            }
            // Verify token
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            // Attach user information to socket client object
            client.data = { userId: payload.sub, role: payload.role };
        }
        catch (err) {
            console.warn('WS Handshake authentication failed:', err.message || err);
            client.disconnect();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleDisconnect(_client) {
        // Graceful disconnect logic
    }
    /**
     * Helper to broadcast websocket events to all connected clients
     */
    emitEvent(event, data) {
        if (this.server) {
            this.server.emit(event, data);
        }
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], EventsGateway.prototype, "server", void 0);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map