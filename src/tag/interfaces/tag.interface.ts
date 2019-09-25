import { Document } from 'mongoose';

export interface ITag extends Document {
    //任务类型 1：抓包；2
    type: Number,
    label: String,
    //判断方式
    match: String,
    //所属根TAG，如果没有，则为根TAG
    root: String,
    children: [String],
    stores: [String]
}
