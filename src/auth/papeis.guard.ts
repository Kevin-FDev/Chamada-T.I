import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { NIVEIS_CHAVE } from "./papeis.decorator.js";
import { RequisicaoComUsuario } from "./requisicao-com-usuario.js";

@Injectable()
export class NiveisGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const exigidos = this.reflector.getAllAndOverride<string[]>(NIVEIS_CHAVE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!exigidos) {
      return true;
    }
    const req = context.switchToHttp().getRequest<RequisicaoComUsuario>();
    if (!exigidos.includes(req.user.papel)) {
      throw new ForbiddenException('Acesso negado');
    }
    return true;
  }
}