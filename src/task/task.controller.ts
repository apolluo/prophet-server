import { Controller, Get, Body, Post } from '@nestjs/common';
import { TaskService } from "./task.service";
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {

    }
    @Post('/add')
    addTask(@Body() createTaskDto: CreateTaskDto) {
        this.taskService.create(createTaskDto)
    }
    @Get()
    getTask() {
        return this.taskService.findAll()
    }
}
