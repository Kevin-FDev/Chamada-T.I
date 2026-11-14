import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChamadoDto {
  @ApiProperty({
    description: 'Resumo do problema',
    example: 'Impressora do financeiro não imprime',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  titulo: string;

  @ApiPropertyOptional({
    description: 'Detalhes do problema',
    example: 'Aparece erro de papel, mas a bandeja está cheia.',
    maxLength: 250,
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  descricao?: string;
}