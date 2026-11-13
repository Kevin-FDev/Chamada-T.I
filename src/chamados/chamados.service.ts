import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChamadoDto } from './dto/create-chamado.dto.js';
import { UpdateChamadoDto } from './dto/update-chamado.dto.js';
import { Chamado } from './entities/chamado.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StatusChamado } from './entities/status-chamado.enum.js';

@Injectable()
export class ChamadosService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChamadoDto: CreateChamadoDto, usuarioId: number): Promise<Chamado> {
    return await this.prisma.chamado.create({
      data: {
        titulo: createChamadoDto.titulo,
        descricao: createChamadoDto.descricao,
        usuarioId: usuarioId
      },
    });
  }

  async findAll(usuarioId: number, papel: string): Promise<Chamado[]> {
    if (papel === 'ADMIN') {
      return await this.prisma.chamado.findMany();
    }

    return await this.prisma.chamado.findMany({ where: { usuarioId } });
  }

  async findOne(
    id: number,
    usuarioId: number,
    papel: string,
  ): Promise<Chamado> {
    const chamado = await this.prisma.chamado.findUnique({ where: { id } });

    if (!chamado) {
      throw new NotFoundException(`ID ${id} não encontrado`);
    }

    if (papel !== 'ADMIN' && chamado.usuarioId !== usuarioId) {
      throw new NotFoundException(`Sem acesso a esse chamado`);
    }

    return chamado;
  }

  async update(
    id: number,
    updateChamadoDto: UpdateChamadoDto,
    usuarioId: number,
    papel: string,
  ): Promise<Chamado> {
    await this.findOne(id, usuarioId, papel);

    return await this.prisma.chamado.update({
      where: { id },
      data: updateChamadoDto,
    });
  }


  async updateStatus(
    id: number,
    status: StatusChamado,
    usuarioId: number,
    papel: string,
  ): Promise<Chamado> {
    await this.findOne(id, usuarioId, papel);

    return await this.prisma.chamado.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number, usuarioId: number, papel: string): Promise<void> {
    await this.findOne(id, usuarioId, papel);

    await this.prisma.chamado.delete({ where: { id } });
  }
}
