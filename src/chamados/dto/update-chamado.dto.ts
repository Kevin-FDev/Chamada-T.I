import { PartialType } from '@nestjs/mapped-types';
import { CreateChamadoDto } from './create-chamado.dto.js';

export class UpdateChamadoDto extends PartialType(CreateChamadoDto) {}
