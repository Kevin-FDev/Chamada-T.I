import { Injectable } from '@nestjs/common';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';
import { Chamado } from './entities/chamado.entity.js';
import { StatusChamado } from './entities/status-chamado.enum.js';

@Injectable()
export class ChamadosService {
  private chamados: Chamado[] = [];
  private proximoCodigo = 1;

  create(createChamadoDto: CreateChamadoDto): Chamado {
    const novoChamado = {
      id: this.proximoCodigo,
      titulo: createChamadoDto.titulo,
      descricao: createChamadoDto.descricao,
      status: StatusChamado.ABERTO,
      criadoEm: new Date(),
    };
    this.proximoCodigo++;
    this.chamados.push(novoChamado);

    return novoChamado;
  }

  findAll() {
    return `This action returns all chamados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chamado`;
  }

  update(id: number, updateChamadoDto: UpdateChamadoDto) {
    return `This action updates a #${id} chamado`;
  }

  remove(id: number) {
    return `This action removes a #${id} chamado`;
  }
}
