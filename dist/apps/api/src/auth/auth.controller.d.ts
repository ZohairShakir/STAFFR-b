import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
export declare class AuthController {
    private readonly configService;
    private readonly authService;
    constructor(configService: ConfigService, authService: AuthService);
    slackRedirect(res: Response): any;
    slackCallback(code: string, res: Response): unknown;
    refresh(req: Request, res: Response): unknown;
    logout(user: User, res: Response): unknown;
}
//# sourceMappingURL=auth.controller.d.ts.map