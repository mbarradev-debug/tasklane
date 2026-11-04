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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) // pide el repositorio de Task
    private readonly tasksRepository: Repository<Task>,
  ) {}

  findAll(ownerId: string): Promise<Task[]> {
    return this.tasksRepository.find({ where: { ownerId } });
  }

  async findOne(id: string, ownerId: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    if (task.ownerId !== ownerId) {
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
    const task = await this.findOne(id, ownerId);
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description; // "" es válido
    return this.tasksRepository.save(task);
  }

  async complete(id: string, ownerId: string): Promise<Task> {
    const task = await this.findOne(id, ownerId);
    if (task.completed) return task; // idempotente: ya estaba completada
    task.completed = true;
    return this.tasksRepository.save(task);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const task = await this.findOne(id, ownerId);
    await this.tasksRepository.remove(task);
  }
}
