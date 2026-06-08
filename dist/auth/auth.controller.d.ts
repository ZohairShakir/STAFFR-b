import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly configService;
    private readonly authService;
    constructor(configService: ConfigService, authService: AuthService);
    slackRedirect(res: Response): void;
    slackCallback(code: string, res: Response): Promise<void>;
    login(body: {
        slackCode: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map