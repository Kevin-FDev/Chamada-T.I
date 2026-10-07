import { Test, TestingModule } from '@nestjs/testing';
import { ChamadosService } from './chamados.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ChamadosService', () => {
  let service: ChamadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChamadosService, PrismaService],
    }).compile();

    service = module.get<ChamadosService>(ChamadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
