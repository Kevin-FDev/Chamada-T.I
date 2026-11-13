import { SetMetadata } from "@nestjs/common";

export const NIVEIS_CHAVE = 'niveis';
export const Niveis = (...niveis: string[]) => SetMetadata(NIVEIS_CHAVE, niveis);
