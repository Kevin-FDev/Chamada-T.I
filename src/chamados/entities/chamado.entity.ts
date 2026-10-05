import { StatusChamado } from './status-chamado.enum.js';

export class Chamado {
  id: number;
  titulo: string;
  descricao?: string;
  status: StatusChamado;
  criadoEm: Date;
}
