import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSourceDto } from './dto/create-source.dto';
import { ISource } from './interfaces/source.interface';

@Injectable()
export class SourceService {
    private logger = new Logger(SourceService.name)
    constructor(@InjectModel('Source') private readonly SourceModel: Model<ISource>) {

    }
    async create(createSourceDto: CreateSourceDto) {
        const createdSource = new this.SourceModel(createSourceDto);
        return await createdSource.save();
    }
    async findAll() {
        return await this.SourceModel.find({})
    }
    async findByIds(sourceIds, callback) {
        this.logger.log('findByIds', sourceIds)
        return await this.SourceModel.find({
            _id: { $in: sourceIds }
        })
            .populate('parse')
            .populate({
                path: 'children',
                populate: { path: 'children' }
            })
            .exec(function (err, source) {
                if (err) {
                    console.log(err);
                }
                console.log(source);
                callback(source);
            });
    }
}
