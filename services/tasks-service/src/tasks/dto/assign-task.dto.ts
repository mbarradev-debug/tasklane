import { IsEmail } from 'class-validator';

// Body de POST /tasks/:id/assign
export class AssignTaskDto {
  @IsEmail()
  email: string;
}
