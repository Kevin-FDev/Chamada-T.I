import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Kevin',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'E-mail (é guardado em minúsculas)',
    example: 'kevin@teste.com',
    maxLength: 250,
  })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @MaxLength(250)
  email: string;

  @ApiProperty({
    description: 'Senha com no mínimo 6 caracteres',
    example: '123456',
    minLength: 6,
    maxLength: 250,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(250)
  senha: string;
}