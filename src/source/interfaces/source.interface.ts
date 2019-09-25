import { Document } from 'mongoose';

export interface ISource extends Document {
    //源类型 1：web；2:search engine; 3 file;
    type: Number,
    //源状态 0：无法访问；1：正常；-1：解析错误；
    status: Number,
    domain: String,
    //源地址 
    src: String,
    //API `http://www.baidu.com/s?ie=utf-8&wd=${key}`
    searchApi: String,
    searchParams: {
        key: String,
        value: String
    },
    //解析规则
    parse: [String],
    //爬详细 0:不爬；1爬并按TAG保存 
    crawlMore:Number
}







