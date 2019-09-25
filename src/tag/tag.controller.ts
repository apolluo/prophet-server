import { Controller, Inject, Post, Body, Get, Put, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { identifier } from '@babel/types';

@ApiUseTags('tag')
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
    @Put(':id')
    @ApiImplicitParam({name:'id'})
    update(@Param('id') id, @Body() dto:CreateTagDto){
        return this.tagService.update(id,dto)
    }
}
