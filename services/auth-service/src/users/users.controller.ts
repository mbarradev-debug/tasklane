import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindByEmailQuery } from './dto/find-by-email.query';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // recibe la capa de servicios

  @Get('by-email')
  async findByEmail(@Query() query: FindByEmailQuery) {
    const user = await this.usersService.findByEmail(query.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { id: user.id, email: user.email, name: user.name };
  }
}
