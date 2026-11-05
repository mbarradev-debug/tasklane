import { Injectable } from '@nestjs/common';
import type { UserSummary } from './user-summary.interface';

@Injectable()
export class UsersClient {
  private readonly baseUrl = process.env.AUTH_SERVICE_URL; // http://auth-service:3001 en Compose

  async findByEmail(email: string): Promise<UserSummary | null> {
    const url = `${this.baseUrl}/users/by-email?email=${encodeURIComponent(email)}`;
    const response = await fetch(url); // petición HTTP a auth-service; aquí se espera la respuesta

    if (response.status === 404) {
      return null; // auth-service dice que nadie tiene ese correo
    }

    return (await response.json()) as UserSummary; // deserializa el body JSON a un objeto
  }
}
