import { Document } from 'mongoose';

export interface IStore extends Document {
    //任务类型 1：抓包；2
    type: Number,
    context: String
    comefrom: String,
    tags: [String]
}
