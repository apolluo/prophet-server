import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { ITask } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { CrawlerService } from '@/crawler/crawler.service';

@Injectable()
export class TaskService {
    constructor(
        @Inject('TASK_MODEL')
        private readonly TaskModel: Model<ITask>,
        private readonly crawlerService:CrawlerService
    ) { }
    async create(createTaskDto: CreateTaskDto): Promise<ITask> {
        const createdTask = new this.TaskModel(createTaskDto);
        this.crawlerService.crawl(createTaskDto)
        return await createdTask.save();
    }

    async findAll(): Promise<ITask[]> {
        return await this.TaskModel.find().exec();
    }

    async update(id,dto):Promise<ITask>{
        return await this.TaskModel.update({_id:id},{$set:dto})
    }
}
