import { IsEmail } from 'class-validator';

export class FindByEmailQuery {
  @IsEmail() // sin email, o con un texto que no es correo → 400 antes de llegar al controlador
  email: string;
}
