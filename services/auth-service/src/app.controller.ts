import { Controller, Get } from '@nestjs/common';

@Controller() // sin ruta: los métodos cuelgan de la raíz
export class AppController {
  @Get('health') // GET /health
  health() {
    return { status: 'ok' }; // Nest lo convierte en JSON
  }
}
