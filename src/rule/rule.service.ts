import { Injectable, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRule } from './interfaces/rule.interface';
import { Model } from 'mongoose';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class RuleService {
    constructor(@InjectModel('Rule') private readonly RuleModel: Model<IRule>) {

    }
    async create(dto: CreateRuleDto) {
        const createRule = new this.RuleModel(dto)
        return await createRule.save()
    }
    async findAll() {
        return await this.RuleModel.find({})
    }
    async update(id, dto) {
        return await this.RuleModel.update({ _id: id }, { $set: dto })
    }
    async remove(id) {
        return await this.RuleModel.remove({ _id: id })
    }
}
