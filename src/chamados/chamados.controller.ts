import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';

@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}

  @Post()
  create(@Body() createChamadoDto: CreateChamadoDto) {
    return this.chamadosService.create(createChamadoDto);
  }

  @Get()
  findAll() {
    return this.chamadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chamadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChamadoDto: UpdateChamadoDto) {
    return this.chamadosService.update(+id, updateChamadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chamadosService.remove(+id);
  }
}
