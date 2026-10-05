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
    const novoChamado: Chamado = {
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

  findAll(): Chamado[] {
    return this.chamados;
  }

  findOne(id: number): Chamado | undefined {
    return this.chamados.find((c) => c.id === id);
  }

  update(id: number, updateChamadoDto: UpdateChamadoDto): Chamado | undefined {
    const chamado = this.findOne(id);
    if (chamado === undefined) {
      return undefined;
    }

    Object.assign(chamado, updateChamadoDto);
    return chamado;
  }

  remove(id: number):void {
    const indice = this.chamados.findIndex((c) => c.id === id);

    if (indice !== -1) {
      this.chamados.splice(indice, 1);
    }
  }
}
