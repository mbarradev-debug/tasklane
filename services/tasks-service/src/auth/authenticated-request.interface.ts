import type { Request } from 'express'; // solo el tipo: desaparece al compilar

// Descripción de lo que devuelve verifyAsync: el payload del token
export interface JwtPayload {
  sub: string; // id del usuario en auth-db (Ana: 'f1130c9d-…')
  email: string; // 'ana@mail.com'
  iat: number; // emisión, en segundos Unix
  exp: number; // vencimiento, en segundos Unix
}

// Descripción de la request de Tasklane después del guard:
// todo lo de Request (extends) + una propiedad user con forma JwtPayload
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
