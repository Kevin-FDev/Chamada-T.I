import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    }); 

    const senhaConfere = usuario
      ? await bcrypt.compare(dto.senha, usuario.senhaHash)
      : false;

    if (!usuario || !senhaConfere) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
    });

    return { accessToken };
  }

  async perfil(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: { nome: true, email: true, papel: true },
    });

    if (!usuario) {
      throw new UnauthorizedException();
    }

    return usuario;
  }
}
