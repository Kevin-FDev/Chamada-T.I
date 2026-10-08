import { ApiProperty} from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Coloque aqui o nome',
    example: 'Kevin',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Coloque aqui seu email',
    example: 'email@gmail.com',
  })
  @MaxLength(250)
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;

  @ApiProperty({
    description: 'Coloque aqui a senha',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(250)
  senha: string;
}
