import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';
const COOKIE_OPTS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};
const ACCESS_OPTS = { ...COOKIE_OPTS, maxAge: 2 * 60 * 60 * 1000 };
const REFRESH_OPTS = { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('slack')
  slackRedirect(@Res() res: Response) {
    const clientId = this.configService.get<string>('SLACK_CLIENT_ID');
    const redirectUri = encodeURIComponent(
      `${this.configService.get<string>('API_URL')}/auth/slack/callback`,
    );
    const scopes = 'identity.basic,identity.email,identity.avatar';
    const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=&user_scope=${scopes}&redirect_uri=${redirectUri}`;
    return res.redirect(slackOAuthUrl);
  }

  @Get('slack/callback')
  async slackCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.redirect(`${this.configService.get<string>('APP_URL')}/login?error=no_code`);
    }

    try {
      const { accessToken, refreshToken } = await this.authService.handleSlackLogin(code);
      res.cookie('access_token', accessToken, ACCESS_OPTS);
      res.cookie('refresh_token', refreshToken, REFRESH_OPTS);
      return res.redirect(`${this.configService.get<string>('APP_URL')}/dashboard`);
    } catch (err) {
      console.error(err);
      return res.redirect(`${this.configService.get<string>('APP_URL')}/login?error=auth_failed`);
    }
  }

  @Post('login')
  async login(@Body() body: { slackCode: string }, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.authService.handleSlackLogin(body.slackCode);
      res.cookie('access_token', accessToken, ACCESS_OPTS);
      res.cookie('refresh_token', refreshToken, REFRESH_OPTS);
      return res.json({ success: true });
    } catch (err) {
      throw new UnauthorizedException('Login failed');
    }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies['refresh_token'] || req.body.refresh_token;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const decoded = jwt.decode(oldRefreshToken) as any;
      const userId = decoded?.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token content');
      }

      const { accessToken, refreshToken } = await this.authService.rotateTokens(oldRefreshToken, userId);
      res.cookie('access_token', accessToken, ACCESS_OPTS);
      res.cookie('refresh_token', refreshToken, REFRESH_OPTS);

      return res.json({ success: true, accessToken });
    } catch (err) {
      throw new UnauthorizedException('Refresh rotation failed');
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['access_token'] || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded?.sub) {
          await this.authService.logout(decoded.sub);
        }
      } catch { /* no-op */ }
    }

    ['access_token', 'refresh_token'].forEach((name) => {
      (['none', 'lax'] as const).forEach((sameSite) => {
        res.clearCookie(name, { path: '/', sameSite, secure: sameSite === 'none' });
      });
    });

    return res.json({ success: true });
  }

}
