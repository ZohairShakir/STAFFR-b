import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { WebClient } from '@slack/web-api';
import Redis from 'ioredis';
import { EventsGateway } from '../gateway/events.gateway';
import { SlackService } from '../slack/slack.service';

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly gateway: EventsGateway,
    private readonly slackService: SlackService,
  ) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.redis = redisUrl ? new Redis(redisUrl) : new Redis();
  }

  // Exchanges auth code for Slack user tokens & profile data, upserting the user in DB
  async handleSlackLogin(code: string) {
    const clientId = this.configService.get<string>('SLACK_CLIENT_ID') || '';
    const clientSecret = this.configService.get<string>('SLACK_CLIENT_SECRET') || '';
    const redirectUri = `${this.configService.get<string>('API_URL')}/auth/slack/callback`;

    const slackClient = new WebClient();

    try {
      // Exchange code for tokens
      const result = await slackClient.oauth.v2.access({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      });

      if (!result.ok) {
        throw new Error(`Slack OAuth failed: ${result.error}`);
      }

      // Read user context. Slack identity scopes provide this:
      // identity.basic, identity.email, identity.avatar
      const authedUser = result.authed_user;
      if (!authedUser) {
        throw new Error('Slack OAuth completed but authed_user is undefined');
      }

      // Get profile info using authed_user.access_token
      const userProfileClient = new WebClient(authedUser.access_token);
      // Under newer Slack web client, identity requires parameter options or assertion
      const identity: any = await userProfileClient.users.identity({});

      if (!identity.ok || !identity.user) {
        throw new Error(`Slack identity fetch failed: ${identity.error || 'No user info returned'}`);
      }

      const slackId = identity.user.id || '';
      const name = identity.user.name || '';
      const email = identity.user.email || '';
      const avatar = identity.user.image_512 || identity.user.image_192 || null;

      // Check if this is the first user in the system. If so, make them Super Admin.
      const userCount = await this.prisma.user.count();
      const defaultRole = userCount === 0 ? UserRole.SUPER_ADMIN : UserRole.TEAM_MEMBER;

      // Upsert User by slackId
      const user = await this.prisma.user.upsert({
        where: { slackId },
        update: { name, avatar },
        create: {
          slackId,
          name,
          email: email || undefined,
          avatar,
          role: defaultRole,
        },
      });

      // Notify Super Admins about new user via Slack DMs + WebSocket
      if (defaultRole === UserRole.TEAM_MEMBER) {
        this.notifySuperAdminsNewUser(user);
      }

      // Generate credentials
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user.id);

      // Store refresh token in Redis: key = refresh:{userId}, value = refreshToken, expiry = 7d (604800s)
      await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', 604800);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      console.error('Slack OAuth error:', error);
      throw new InternalServerErrorException(error.message || 'OAuth authentication failed');
    }
  }

  generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });
  }

  generateRefreshToken(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d',
    });
  }

  async rotateTokens(oldRefreshToken: string, userId: string) {
    const stored = await this.redis.get(`refresh:${userId}`);
    if (!stored || stored !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', 604800);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.redis.del(`refresh:${userId}`);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private async notifySuperAdminsNewUser(newUser: User) {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: UserRole.SUPER_ADMIN },
        select: { id: true, slackId: true },
      });

      const text = `New user joined STAFFR: *${newUser.name}* (${newUser.email || 'no email'}).`;

      for (const admin of admins) {
        if (admin.slackId) {
          try {
            await this.slackService.sendDM(admin.slackId, text);
          } catch {}
        }
      }

      this.gateway.emitEvent('user.created', {
        userId: newUser.id,
        name: newUser.name,
        role: newUser.role,
      });
    } catch (err) {
      console.error('Failed to notify admins of new user:', err);
    }
  }
}
