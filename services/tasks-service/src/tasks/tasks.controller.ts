import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.interface';
import { AssignTaskDto } from './dto/assign-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // todas las rutas de TaskController quedan protegidas
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest): Promise<Task[]> {
    return this.tasksService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.findOne(id, req.user.sub);
  }

  create(
    @Body() dto: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.create(dto, req.user.sub); // el dueño sale del token verificado
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.update(id, dto, req.user.sub);
  }

  @Patch(':id/complete')
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.complete(id, req.user.sub);
  }

  @Post(':id/assign')
  @HttpCode(200)
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.assign(id, dto.email, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.tasksService.remove(id, req.user.sub);
  }
}
