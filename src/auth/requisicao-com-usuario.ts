import type { Request } from 'express';

export interface RequisicaoComUsuario extends Request {
  user: {
    sub: number;
    email: string;
    papel: string;
  };
}