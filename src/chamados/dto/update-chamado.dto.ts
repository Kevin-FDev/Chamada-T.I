
import {PartialType} from '@nestjs/swagger';
import { CreateChamadoDto } from './create-chamado.dto.js';

export class UpdateChamadoDto extends PartialType(CreateChamadoDto) {}
