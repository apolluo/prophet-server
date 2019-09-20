import * as mongoose from 'mongoose';
import { type } from 'os';
import { ObjectId } from 'bson';

export const SourceSchema = new mongoose.Schema({
    //源类型 1：web；2:search engine; 3 file;
    type: {type:Number,default:1},
    //源状态 0：无法访问；1：正常；-1：解析错误；
    status: {type:Number,default:1},
    domain:String,
    //源地址 
    src: String,
    //API '`http://www.baidu.com/s?ie=utf-8&wd=${searchParams.key}`'
    searchApi:String,
    searchParams:{
        key:String,
        value:String
    },
    //解析规则
    parse:[{type:ObjectId,ref:'Rule'}]
}, {
    collection: 'source', versionKey: false,timestamps: true
});
