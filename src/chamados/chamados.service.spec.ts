import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StatusChamado } from './entities/status-chamado.enum.js';

const mockPrismaService = {
  chamado: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

describe('ChamadosService', () => {
  let service: ChamadosService;
  let prisma: typeof mockPrismaService;


  const chamadoDoUsuario5 = {
    id: 1,
    titulo: 'Impressora não imprime',
    descricao: 'Aparece erro de papel',
    status: StatusChamado.ABERTO,
    criadoEm: new Date(),
    usuarioId: 5,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChamadosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChamadosService>(ChamadosService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('grava o chamado com o usuarioId recebido', async () => {
      prisma.chamado.create.mockResolvedValue(chamadoDoUsuario5);

      await service.create({ titulo: 'Impressora não imprime' }, 5);

      expect(prisma.chamado.create).toHaveBeenCalledWith({
        data: {
          titulo: 'Impressora não imprime',
          descricao: undefined,
          usuarioId: 5,
        },
      });
    });
  });

  describe('findAll', () => {
    it('usuario comum lista só os chamados dele', async () => {
      prisma.chamado.findMany.mockResolvedValue([chamadoDoUsuario5]);

      await service.findAll(5, 'USER');

      expect(prisma.chamado.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 5 },
      });
    });

    it('admin lista todos os chamados, sem filtro', async () => {
      prisma.chamado.findMany.mockResolvedValue([chamadoDoUsuario5]);

      await service.findAll(9, 'ADMIN');

      expect(prisma.chamado.findMany).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('o dono recebe o chamado dele', async () => {
      prisma.chamado.findUnique.mockResolvedValue(chamadoDoUsuario5);

      const result = await service.findOne(1, 5, 'USER');

      expect(result).toEqual(chamadoDoUsuario5);
    });

    it('outro usuario comum recebe 404', async () => {
      prisma.chamado.findUnique.mockResolvedValue(chamadoDoUsuario5);

      await expect(service.findOne(1, 7, 'USER')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('admin recebe o chamado de outra pessoa', async () => {
      prisma.chamado.findUnique.mockResolvedValue(chamadoDoUsuario5);

      const result = await service.findOne(1, 9, 'ADMIN');

      expect(result).toEqual(chamadoDoUsuario5);
    });

    it('lança NotFoundException quando o chamado não existe', async () => {
      prisma.chamado.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999, 5, 'USER')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('atualiza só o status do chamado', async () => {
      prisma.chamado.findUnique.mockResolvedValue(chamadoDoUsuario5);
      prisma.chamado.update.mockResolvedValue({
        ...chamadoDoUsuario5,
        status: StatusChamado.EM_ANDAMENTO,
      });

      await service.updateStatus(1, StatusChamado.EM_ANDAMENTO, 9, 'ADMIN');

      expect(prisma.chamado.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: StatusChamado.EM_ANDAMENTO },
      });
    });

    it('não atualiza quando o chamado não existe', async () => {
      prisma.chamado.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, StatusChamado.CONCLUIDO, 9, 'ADMIN'),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.chamado.update).not.toHaveBeenCalled();
    });
  });
});