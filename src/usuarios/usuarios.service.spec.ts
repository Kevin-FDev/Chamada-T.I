import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UsuariosService } from './usuarios.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const prismaFalso = {
  usuario: { findUnique: vi.fn(), create: vi.fn() },
};

describe('UsuariosService', () => {
  let service: UsuariosService;

  const dto = { nome: 'Kevin', email: 'kevin@teste.com', senha: '123456' };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prismaFalso },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('grava a senha em hash, nunca em texto puro', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValue(null);
      prismaFalso.usuario.create.mockResolvedValue({
        id: 1,
        nome: dto.nome,
        email: dto.email,
        papel: 'USER',
        criadoEm: new Date(),
      });

      await service.create(dto);

      const argumentos = prismaFalso.usuario.create.mock.calls[0][0];
      expect(argumentos.data.senhaHash).not.toBe(dto.senha);
      expect(await bcrypt.compare(dto.senha, argumentos.data.senhaHash)).toBe(
        true,
      );
    });

    it('não pede o senhaHash de volta e não define o papel', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValue(null);
      prismaFalso.usuario.create.mockResolvedValue({ id: 1 });

      await service.create(dto);

      const argumentos = prismaFalso.usuario.create.mock.calls[0][0];
      expect(argumentos.select.senhaHash).toBeUndefined();
      expect(argumentos.data).not.toHaveProperty('papel');
    });

    it('lança 409 quando o e-mail já existe e não grava nada', async () => {
      prismaFalso.usuario.findUnique.mockResolvedValue({
        id: 1,
        email: dto.email,
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(prismaFalso.usuario.create).not.toHaveBeenCalled();
    });
  });
});