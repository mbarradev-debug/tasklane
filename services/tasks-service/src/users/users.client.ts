import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { UserSummary } from './user-summary.interface';

const AUTH_TIMEOUT_MS = 3000; // límite de espera por auth-service

@Injectable()
export class UsersClient {
  private readonly baseUrl = process.env.AUTH_SERVICE_URL; // http://auth-service:3001 en Compose

  async findByEmail(email: string): Promise<UserSummary | null> {
    const url = `${this.baseUrl}/users/by-email?email=${encodeURIComponent(email)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
      });
    } catch {
      // auth-service apagado (ENOTFOUND), rechazando (ECONNREFUSED) o sin responder en 3 s
      throw new ServiceUnavailableException('auth-service is unavailable');
    }

    if (response.status === 404) {
      return null; // auth-service dice que nadie tiene ese correo
    }
    if (!response.ok) {
      // auth-service respondió, pero con un error propio (ej. 500)
      throw new ServiceUnavailableException('auth-service is unavailable');
    }

    return (await response.json()) as UserSummary; // deserializa el body JSON a un objeto
  }
}
