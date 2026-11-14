import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const prismaFalso = {
  usuario: { findUnique: vi.fn() },
};

const jwtFalso = {
  signAsync: vi.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usuarioNoBanco: {
    id: number;
    email: string;
    senhaHash: string;
    papel: string;
  };

  beforeAll(async () => {
    // Hash de verdade da senha 123456 (custo 4 só para o teste ser rápido)
    const senhaHash = await bcrypt.hash('123456', 4);
    usuarioNoBanco = {
      id: 5,
      email: 'kevin@teste.com',
      senhaHash,
      papel: 'USER',
    };
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaFalso },
        { provide: JwtService, useValue: jwtFalso },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('com e-mail e senha certos, devolve o token', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValue(usuarioNoBanco);
      jwtFalso.signAsync.mockResolvedValue('token-de-teste');

      const resultado = await service.login({
        email: 'kevin@teste.com',
        senha: '123456',
      });

      expect(resultado).toEqual({ accessToken: 'token-de-teste' });
      expect(jwtFalso.signAsync).toHaveBeenCalledWith({
        sub: 5,
        email: 'kevin@teste.com',
        papel: 'USER',
      });
    });

    it('com e-mail que não existe, lança 401 e não gera token', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ninguem@teste.com', senha: '123456' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtFalso.signAsync).not.toHaveBeenCalled();
    });

    it('com senha errada, lança 401 e não gera token', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValue(usuarioNoBanco);

      await expect(
        service.login({ email: 'kevin@teste.com', senha: 'senha-errada' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtFalso.signAsync).not.toHaveBeenCalled();
    });

    it('e-mail inexistente e senha errada dão a mesma mensagem', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.login({ email: 'ninguem@teste.com', senha: '123456' }),
      ).rejects.toThrow('E-mail ou senha inválidos');

      prismaFalso.usuario.findUnique.mockResolvedValueOnce(usuarioNoBanco);
      await expect(
        service.login({ email: 'kevin@teste.com', senha: 'senha-errada' }),
      ).rejects.toThrow('E-mail ou senha inválidos');
    });
  });
});