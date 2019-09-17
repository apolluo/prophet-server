import { Controller, Inject, Post, Body, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {

    }
    @Post()
    addTag(@Body() createTagDto: CreateTagDto) {
        this.tagService.addTag(createTagDto)
    }
    @Get()
    findAll() {
        return this.tagService.findAll()
    }
}
