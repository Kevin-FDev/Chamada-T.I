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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChamadosService } from './chamados.service.js';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { NiveisGuard } from '../auth/papeis.guard.js';
import { Niveis } from '../auth/papeis.decorator.js';
import type { RequisicaoComUsuario } from '../auth/requisicao-com-usuario.js';

@ApiTags('chamados')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}

  @Post()
  @ApiOperation({ summary: 'Abrir um chamado (nasce com status ABERTO)' })
  @ApiResponse({ status: 201, description: 'Chamado criado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Sem token ou token inválido.' })
  create(@Body() dto: CreateChamadoDto, @Req() req: RequisicaoComUsuario) {
    return this.chamadosService.create(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar chamados (o usuário vê os seus, o admin vê todos)',
  })
  @ApiResponse({ status: 200, description: 'Lista de chamados.' })
  @ApiResponse({ status: 401, description: 'Sem token ou token inválido.' })
  findAll(@Req() req: RequisicaoComUsuario) {
    return this.chamadosService.findAll(req.user.sub, req.user.papel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um chamado pelo id' })
  @ApiParam({ name: 'id', description: 'Id do chamado', example: 1 })
  @ApiResponse({ status: 200, description: 'Chamado encontrado.' })
  @ApiResponse({ status: 400, description: 'O id não é um número.' })
  @ApiResponse({ status: 401, description: 'Sem token ou token inválido.' })
  @ApiResponse({
    status: 404,
    description: 'Chamado não existe ou pertence a outro usuário.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequisicaoComUsuario,
  ) {
    return this.chamadosService.findOne(id, req.user.sub, req.user.papel);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Alterar título e/ou descrição do chamado' })
  @ApiParam({ name: 'id', description: 'Id do chamado', example: 1 })
  @ApiResponse({ status: 200, description: 'Chamado atualizado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Sem token ou token inválido.' })
  @ApiResponse({
    status: 404,
    description: 'Chamado não existe ou pertence a outro usuário.',
  })
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
  @ApiOperation({ summary: 'Alterar o status do chamado (somente ADMIN)' })
  @ApiParam({ name: 'id', description: 'Id do chamado', example: 1 })
  @ApiResponse({ status: 200, description: 'Status atualizado.' })
  @ApiResponse({ status: 400, description: 'Status inválido.' })
  @ApiResponse({ status: 401, description: 'Sem token ou token inválido.' })
  @ApiResponse({ status: 403, description: 'O usuário não é administrador.' })
  @ApiResponse({ status: 404, description: 'Chamado não encontrado.' })
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
  @ApiOperation({ summary: 'Remover um chamado' })
  @ApiParam({ name: 'id', description: 'Id do chamado', example: 1 })
  @ApiResponse({ status: 200, description: 'Chamado removido.' })
  @ApiResponse({ status: 401, description: 'Sem token ou token inválido.' })
  @ApiResponse({
    status: 404,
    description: 'Chamado não existe ou pertence a outro usuário.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequisicaoComUsuario,
  ) {
    return this.chamadosService.remove(id, req.user.sub, req.user.papel);
  }
}