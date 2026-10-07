import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChamadoDto {
  @ApiProperty({
    description: 'Coloque aqui o titulo',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  titulo: string;

  @ApiPropertyOptional({
    description: 'Coloque aqui o titulo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  descricao?: string;
}
  