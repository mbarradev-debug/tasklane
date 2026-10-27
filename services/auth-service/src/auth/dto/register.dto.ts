import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() // "ana" → 400; "ana@mail.com" → válido
  email: string;

  @IsString()
  @IsNotEmpty() // "" → 400
  name: string;

  @IsString()
  @MinLength(8) // "1234" → 400; "secreto123" → válido
  password: string; // contraseña en texto plano: solo existe en esta petición, nunca se guarda
}
