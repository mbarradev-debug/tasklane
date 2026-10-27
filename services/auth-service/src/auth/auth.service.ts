import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // la lista de compradores
    private readonly jwtService: JwtService, // la máquina selladora (llega desde JwtModule)
  ) {} // recibe UsersService (capa 2)

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email); // ¿ya existe ese correo?
    if (existing) {
      throw new ConflictException('Email already registered'); // regla: correo repetido → 409
    }

    const passwordHash = await bcrypt.hash(dto.password, 10); // regla: guardar solo el hash

    const user = await this.usersService.create({
      // pide a UsersService el INSERT
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    return { id: user.id, email: user.email, name: user.name }; // nunca devolver passwordHash
  }

  async login(dto: LoginDto) {
    // 1 · buscar al usuario
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // el correo no existe
    }

    // 2 · comparar la contraseña con el hash guardado
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials'); // mismo mensaje: no revelar cuál falló
    }

    // 3 · armar el payload: solo identificadores
    const payload = { sub: user.id, email: user.email };

    // 4 · firmar con JWT_SECRET (configurado en JwtModule.register)
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
