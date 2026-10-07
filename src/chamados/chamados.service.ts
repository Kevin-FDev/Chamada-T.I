import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';
import { Chamado } from './entities/chamado.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ChamadosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChamadoDto: CreateChamadoDto): Promise<Chamado> {
    return await this.prisma.chamado.create({
      data: {
        titulo: createChamadoDto.titulo,
        descricao: createChamadoDto.descricao,
      },
    });
  }

  async findAll(): Promise<Chamado[]> {
    return await this.prisma.chamado.findMany();
  }

  async findOne(id: number): Promise<Chamado> {
    const chamado = await this.prisma.chamado.findUnique({where: {id}});

    if (!chamado) {
      throw new NotFoundException(`ID ${id} não encontrado`);
    }

    return chamado;
  }

  async update(id: number, updateChamadoDto: UpdateChamadoDto): Promise<Chamado> {
    
    await this.findOne(id)

    return await this.prisma.chamado.update({ where: { id }, data: updateChamadoDto });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id)

    await this.prisma.chamado.delete({where: {id}});

  
  }
}
