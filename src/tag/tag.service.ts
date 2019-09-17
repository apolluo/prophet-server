import { Injectable, Inject, Post, Body } from '@nestjs/common';
import { Model } from 'mongoose';
import { ITag } from './interfaces/tag.interface';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
    constructor(@Inject('TAG_MODULE')
    private readonly TagModel:Model<ITag>){

    }
    @Post()
    async addTag(@Body() createTagDto:CreateTagDto):Promise<ITag>{
        const createdTag = new this.TagModel(createTagDto);
        return await createdTag.save();
    }
}
