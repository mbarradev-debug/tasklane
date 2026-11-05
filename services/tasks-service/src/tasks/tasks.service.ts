import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { UsersClient } from '../users/users.client';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) // pide el repositorio de Task
    private readonly tasksRepository: Repository<Task>,
    private readonly usersClient: UsersClient,
  ) {}

  findAll(userId: string): Promise<Task[]> {
    // Arreglo en where = OR: las tareas que creó o que le asignaron
    return this.tasksRepository.find({
      where: [{ ownerId: userId }, { assigneeId: userId }],
    });
  }

  // Búsqueda común: 404 si la tarea no existe
  private async findTask(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  // Para ver y completar: dueño o asignado
  async findAccessible(id: string, userId: string): Promise<Task> {
    const task = await this.findTask(id);
    if (task.ownerId !== userId && task.assigneeId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return task;
  }

  // Para editar, borrar y reasignar: solo el dueño
  private async findOwned(id: string, userId: string): Promise<Task> {
    const task = await this.findTask(id);
    if (task.ownerId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }
    return task;
  }

  create(dto: CreateTaskDto, ownerId: string): Promise<Task> {
    // nuevo parámetro
    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description ?? '', // deja esta línea como la tengas
      ownerId, // nuevo: abreviatura de "ownerId: ownerId"
    });
    return this.tasksRepository.save(task);
  }

  async update(id: string, dto: UpdateTaskDto, ownerId: string): Promise<Task> {
    const task = await this.findOwned(id, ownerId);
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description; // "" es válido
    return this.tasksRepository.save(task);
  }

  async complete(id: string, userId: string): Promise<Task> {
    const task = await this.findAccessible(id, userId);
    if (task.completed) return task; // idempotente: ya estaba completada
    task.completed = true;
    return this.tasksRepository.save(task);
  }

  async assign(id: string, email: string, ownerId: string): Promise<Task> {
    const task = await this.findOwned(id, ownerId); // 404 si no existe, 403 si no es de quien pide

    const assignee = await this.usersClient.findByEmail(email); // pregunta a auth-service
    if (!assignee) {
      throw new NotFoundException(`User ${email} not found`);
    }

    task.assigneeId = assignee.id;
    return this.tasksRepository.save(task); // UPDATE tasks SET "assigneeId" = ... WHERE id = ...
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const task = await this.findOwned(id, ownerId);
    await this.tasksRepository.remove(task);
  }
}
