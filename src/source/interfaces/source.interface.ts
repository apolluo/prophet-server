import { Document } from 'mongoose';

export interface ISource extends Document {
    //任务类型 1：抓包；2
    type: Number,
    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    status: Number,
    //任务是否结束
    context: String,
    createTime: Date,
    updateTime: Date
}
