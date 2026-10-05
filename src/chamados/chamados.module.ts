import { Module } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { ChamadosController } from './chamados.controller.js';

@Module({
  controllers: [ChamadosController],
  providers: [ChamadosService],
})
export class ChamadosModule {}
