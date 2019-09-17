import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSourceDto } from './dto/create-source.dto';
import { ISource } from './interfaces/source.interface';

@Injectable()
export class SourceService {
    constructor(@InjectModel('Source') private readonly SourceModel: Model<ISource>) {

    }
    async create(createSourceDto: CreateSourceDto) {
        const createdSource = new this.SourceModel(createSourceDto);
        return await createdSource.save();
    }
    async findAll() {
        return await this.SourceModel.find({})
    }
}
