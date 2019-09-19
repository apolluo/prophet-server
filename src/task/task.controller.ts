import { Controller, Get, Body, Post } from '@nestjs/common';
import { TaskService } from "./task.service";
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { CrawlerService } from '@/crawler/crawler.service';

@ApiUseTags('task')
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService, private readonly crawlerService: CrawlerService) {

    }
    @Post('/add')
    addTask(@Body() createTaskDto: CreateTaskDto) {
        this.taskService.create(createTaskDto).then(
            () => this.crawlerService.crawlUrl(createTaskDto.link)
        ).catch((e) => { console.log('error', e) })

    }
    @Get()
    getTask() {
        return this.taskService.findAll()
    }
}
