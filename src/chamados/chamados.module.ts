import { Module } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { ChamadosController } from './chamados.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [ChamadosController],
  providers: [ChamadosService],
  imports:[
    PrismaModule
  ]
})
export class ChamadosModule {}
