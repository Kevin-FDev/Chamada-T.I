import { Module } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { ChamadosController } from './chamados.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [ChamadosController],
  providers: [ChamadosService],
  imports:[
    PrismaModule,
    AuthModule
  ]
})
export class ChamadosModule {}
