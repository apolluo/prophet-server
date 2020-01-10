import { Document } from 'mongoose';

export interface IStore extends Document {
    //任务类型 1：抓包；2
    type: Number,
    name: String,
    title: String,
    author: String,
    des: String,
    children: [String]
    context: String
    comefrom: String,
    comefromDomain:String,
    comefromUrl: String,
    tags: [String]
}
