import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express'; // solo el tipo de la request
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {} // inyectado, como en AuthService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing token'); // sin pulsera -> 401
    }
    try {
      await this.jwtService.verifyAsync(token); // recalcula la firma con JWT_SECRET
    } catch {
      throw new UnauthorizedException('Invalid token'); // falsa o vencida -> 401
    }
    return true; // pulsera auténtica: pasa
  }
}
