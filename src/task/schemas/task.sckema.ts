import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
    //任务类型 1：抓包；2
    type: Number,
    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    status: Number,
    //任务是否结束
    complete: { type: Boolean, default: false },
    createTime: Date,
    updateTime: { type: Date, default: Date.now }
});
