import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusChamado } from '../entities/status-chamado.enum.js';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Novo status do chamado',
    enum: StatusChamado,
    example: StatusChamado.EM_ANDAMENTO,
  })
  @IsEnum(StatusChamado)
  status: StatusChamado;
}