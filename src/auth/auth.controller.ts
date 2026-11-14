import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Entrar no sistema e receber o token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login feito. Devolve o accessToken.',
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail ou senha fora do formato.',
  })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}