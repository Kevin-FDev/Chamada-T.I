import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChamadosService } from './chamados.service.js';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { NiveisGuard } from '../auth/papeis.guard.js';
import { Niveis } from '../auth/papeis.decorator.js';
import type { RequisicaoComUsuario } from '../auth/requisicao-com-usuario.js';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}

  @Post()
  create(@Body() dto: CreateChamadoDto, @Req() req: RequisicaoComUsuario) {
    return this.chamadosService.create(dto, req.user.sub);
  }

  @Get()
  findAll(@Req() req: RequisicaoComUsuario) {
    return this.chamadosService.findAll(req.user.sub, req.user.papel);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequisicaoComUsuario,
  ) {
    return this.chamadosService.findOne(id, req.user.sub, req.user.papel);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChamadoDto: UpdateChamadoDto,
    @Req() req: RequisicaoComUsuario,
  ) {
    return this.chamadosService.update(
      id,
      updateChamadoDto,
      req.user.sub,
      req.user.papel,
    );
  }

  @Patch(':id/status')
  @UseGuards(NiveisGuard)
  @Niveis('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: RequisicaoComUsuario,
  ) {
    return this.chamadosService.updateStatus(
      id,
      updateStatusDto.status,
      req.user.sub,
      req.user.papel,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequisicaoComUsuario,
  ) {
    return this.chamadosService.remove(id, req.user.sub, req.user.papel);
  }
}