import { StatusChamado } from "../../generated/prisma/enums.js";


export class Chamado {
  id: number;
  titulo: string;
  descricao: string|null;
  status: StatusChamado;
  criadoEm: Date;
}
