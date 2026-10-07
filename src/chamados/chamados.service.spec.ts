import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { PrismaService } from '../prisma/prisma.service.js';


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

  beforeEach(async () => {
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

 
  describe('findOne', () => {
    it('deve retornar um chamado quando o ID existir', async () => {
      const mockChamado = {
         id: 1, 
         titulo: 'erro no sistema blablabla', 
         descricao: 'Não consigo fazer a compra do meu... ixiii' 
        };
      prisma.chamado.findUnique.mockResolvedValue(mockChamado);

      const result = await service.findOne(1);
      expect(result).toEqual(mockChamado);
    });

  
    it('deve lançar NotFoundException quando o chamado não for encontrado', async () => {
      prisma.chamado.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});