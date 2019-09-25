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
        return await this.TagModel.find().exec()
    }
    async update(id,dto){
        return await this.TagModel.update({_id:id},{$set:dto})
    }
    async getTags(content:string){
        let res=[]
        let tags= await this.findAll()
        //console.log(tags)
        tags.forEach(tag=>{
            if(!tag.match)return;
            //console.log(tag)
           if( new RegExp(tag.match.toString(),'ig').test(content)){
               res.push(tag)
           }
        })
        return res
    }

}
