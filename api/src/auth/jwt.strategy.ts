import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => this.getTokenFromCookies(request)]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }

  getTokenFromCookies (request: Request) {
    const cookie = request?.cookies["access_token"];
    if(!cookie) return null;
    return cookie;
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}