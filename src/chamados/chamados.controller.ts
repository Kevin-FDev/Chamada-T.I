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
import { ChamadosService } from './chamados.service.js';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chamadosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChamadoDto: UpdateChamadoDto,
  ) {
    return this.chamadosService.update(id, updateChamadoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chamadosService.remove(id);
  }
}
