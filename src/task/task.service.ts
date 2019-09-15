import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { ITask } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
    constructor(
        @Inject('TASK_MODEL')
        private readonly TaskModel: Model<ITask>
    ) { }
    async create(createTaskDto: CreateTaskDto): Promise<ITask> {
        const createdTask = new this.TaskModel(createTaskDto);
        return await createdTask.save();
    }

    async findAll(): Promise<ITask[]> {
        return await this.TaskModel.find().exec();
    }

}
