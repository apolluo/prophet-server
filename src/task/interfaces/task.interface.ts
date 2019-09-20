import { Document } from 'mongoose';

export interface ITask extends Document {
    //任务类型 {name:'type',enum:['系统任务','用户任务','管理员任务']}
    type: Number,
    //任务次数
    count: Number,
    //任务间隔 单位S
    interval: Number,
    //任务周期 M-W-D 情人节2--14 每月1号10点 ---1-10 每周一10点 
    cycle: String,
    //爬取方式 1：通过链接爬；2：通过源爬；3：通过Store；4：先Store，后源
    crawlType: { type: Number, required: true, default: 1 },
    // task name
    name: String,
    //任务描述
    desc: String,
    //链接
    link: String,
    //源
    source: [String],
    //搜索方式 { name: 'searchType', enum: ['Tag', 'Txt', 'Rule'] }
    searchType: Number,
    //根据tag搜索
    searchTag: [String],
    //根据文字搜索
    searchTxt: [String],
    //根据规则搜索  web规则、搜索引擎规则、源规则
    searchRule: [String],
    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    status: Number
}
