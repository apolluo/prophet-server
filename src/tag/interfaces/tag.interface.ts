import { Document } from 'mongoose';

export interface ITag extends Document {
    //任务类型 1：抓包；2
    type: Number,
    label:String,
    stores:[String]
}
