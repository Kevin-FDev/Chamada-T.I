import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import type { RequestComUsuario } from './jwt-auth.guard.js';

const opcoesCookie: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Entrar no sistema e receber o token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login feito. Grava o cookie e devolve o accessToken.',
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail ou senha fora do formato.',
  })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos.' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resultado = await this.authService.login(dto);

    res.cookie('access_token', resultado.accessToken, {
      ...opcoesCookie,
      maxAge: 60 * 60 * 1000,
    });

    return resultado;
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sair do sistema (apaga o cookie)' })
  @ApiResponse({ status: 200, description: 'Cookie apagado.' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', opcoesCookie);
    return { message: 'Logout realizado' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dados de quem está logado' })
  @ApiResponse({ status: 200, description: 'Nome, e-mail e papel.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  me(@Req() req: RequestComUsuario) {
    return this.authService.perfil(req.user.sub);
  }
}