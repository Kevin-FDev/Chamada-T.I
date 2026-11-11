import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // Importamos o ConfigModule para que o JwtModule encontre o token do ConfigService
        ConfigModule.forRoot({ isGlobal: true }), 
        AuthModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        // Substituímos o comportamento do ConfigService usando a sintaxe do Vitest (vi.fn)
        getOrThrow: vi.fn().mockReturnValue('mocked_jwt_secret'),
      })
      .compile();
  });

  it('deve compilar o módulo com sucesso', () => {
    expect(module).toBeDefined();
  });

  it('deve injetar o JwtService corretamente com as configurações da factory', () => {
    const jwtService = module.get<JwtService>(JwtService);
    expect(jwtService).toBeDefined();
  });
});
