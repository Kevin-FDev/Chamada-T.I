import { Test, TestingModule } from '@nestjs/testing';
import { ChamadosController } from './chamados.controller.js';
import { ChamadosService } from './chamados.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { NiveisGuard } from '../auth/papeis.guard.js';

describe('ChamadosController', () => {
  let controller: ChamadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChamadosController],
      providers: [{ provide: ChamadosService, useValue: {} }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(NiveisGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ChamadosController>(ChamadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});