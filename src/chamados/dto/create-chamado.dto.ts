import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChamadoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  titulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  descricao?: string;
}
  