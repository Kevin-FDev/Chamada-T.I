import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    const email = dto.email.trim().toLowerCase();

    const existente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existente) {
      throw new ConflictException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    try {
      return await this.prisma.usuario.create({
        data: { nome: dto.nome, email, senhaHash },
        select: {
          id: true,
          nome: true,
          email: true,
          papel: true,
          criadoEm: true,
        },
      });
    } catch (erro) {
      if (
        typeof erro === 'object' &&
        erro !== null &&
        'code' in erro &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException('Email já cadastrado');
      }
      throw erro;
    }
  }
}