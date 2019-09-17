import * as mongoose from 'mongoose';

export const SourceSchema = new mongoose.Schema({
    //任务类型 1：抓包；2
    type: Number,
    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    status: Number,
    context: String,
    createTime: Date,
    updateTime: { type: Date, default: Date.now }
}, {
    collection: 'source', versionKey: false
});
