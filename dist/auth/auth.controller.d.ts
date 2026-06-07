import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
export declare class AuthController {
    private readonly configService;
    private readonly authService;
    constructor(configService: ConfigService, authService: AuthService);
    slackRedirect(res: Response): void;
    slackCallback(code: string, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(user: User, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map