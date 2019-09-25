import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';
import { Cycle } from '@/schemaType/Cycle';
//爬次数 爬方式 爬内容 爬时间 爬的源
export const TaskSchema = new mongoose.Schema({
    //任务类型 {name:'type',enum:['系统任务','用户任务','管理员任务']}
    type: Number,
    //任务次数
    count: Number,
    //任务间隔 单位S
    interval: Number,
    //任务周期 M-W-D 情人节2--14 每月1号10点 ---1-10 每周一10点 
    cycle: Cycle,
    //爬取方式 1：通过链接爬；2：通过源爬；3：通过Store；4：先Store，后源
    crawlType: { type: Number, required: true, default: 1 },
    // task name
    name: String,
    //任务描述
    desc: String,
    //链接
    link: String,
    //源
    source: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Source' }],
    //搜索方式 { name: 'searchType', enum: ['Tag', 'Txt', 'Rule','params','wd'] }
    searchType: Number,
    //根据tag搜索
    searchTag: [{ type: ObjectId, ref: 'Tag' }],
    //根据文字搜索
    searchTxt: [String],
    //根据规则搜索  web规则、搜索引擎规则、源规则
    searchRule: [{ type: ObjectId, ref: 'Rule' }],
    //根据请求参数搜索
    searchParams: Object,
    //根据关键词搜索
    searchWd: String,
    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    status: Number,
    //任务是否结束
    complete: { type: Boolean, default: false },
    
}, {
    timestamps: true
});
