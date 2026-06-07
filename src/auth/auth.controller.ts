import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

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
    // Request basic info, email, and avatar scopes
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

      // Set Access Token in HttpOnly cookie
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect back to Next.js dashboard
      return res.redirect(`${this.configService.get<string>('APP_URL')}/dashboard`);
    } catch (err) {
      console.error(err);
      return res.redirect(
        `${this.configService.get<string>('APP_URL')}/login?error=auth_failed`,
      );
    }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies['refresh_token'] || req.body.refresh_token;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      // Decode user ID from token safely (even if expired)
      const decoded = jwt.decode(oldRefreshToken) as any;
      const userId = decoded?.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token content');
      }

      const { accessToken, refreshToken } = await this.authService.rotateTokens(
        oldRefreshToken,
        userId,
      );

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, accessToken });
    } catch (err) {
      throw new UnauthorizedException('Refresh rotation failed');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser() user: User, @Res() res: Response) {
    await this.authService.logout(user.id);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.json({ success: true });
  }
}
