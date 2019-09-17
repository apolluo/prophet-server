import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ITag } from './interfaces/tag.interface';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
    constructor(@Inject('TAG_MODEL')
    private readonly TagModel: Model<ITag>) {

    }
    async addTag(createTagDto: CreateTagDto): Promise<ITag> {
        const createdTag = new this.TagModel(createTagDto);
        return await createdTag.save();
    }
    async findAll() {
        return this.TagModel.find().exec()
    }

}
