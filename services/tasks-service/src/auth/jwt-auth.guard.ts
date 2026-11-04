import {
  CanActivate, // interface de NestJS (el contrato del guard)
  ExecutionContext, // interface de NestJS (la información de la petición)
  Injectable, // decorador de NestJS
  UnauthorizedException, // clase de NestJS (excepción HTTP 401)
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // clase de @nestjs/jwt (se inyecta)
import type {
  AuthenticatedRequest, // interface nuestra (Paso 4.1)
  JwtPayload, // interface nuestra (Paso 4.1)
} from './authenticated-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getRequest<T>() también es un método genérico (de NestJS): T = nuestra interface
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing token'); // sin token: 401, user no se crea
    }
    try {
      // T = JwtPayload: TypeScript ahora revisa la asignación a request.user
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token'); // firma o exp inválidos: 401
    }
    return true; // solo se llega aquí si request.user quedó asignado
  }
}
