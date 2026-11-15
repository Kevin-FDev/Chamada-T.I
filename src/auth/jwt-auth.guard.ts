import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { Papel } from '../generated/prisma/enums.js';

export type UsuarioDoToken = {
  sub: number;
  email: string;
  papel: Papel;
};

export type RequestComUsuario = Request & { user: UsuarioDoToken };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestComUsuario>();
    const token = this.extrairToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.jwtService.verifyAsync<UsuarioDoToken>(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extrairToken(request: RequestComUsuario): string | undefined {
    const doCookie = request.cookies?.access_token as string | undefined;
    if (doCookie) {
      return doCookie;
    }

    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}