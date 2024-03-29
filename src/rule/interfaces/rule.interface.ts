import { Document } from 'mongoose';

export interface IRule extends Document {
    //规则类型 {name:'type',enum:['web规则','Store规则', '源规则','具体页面规则','具体内容规则']}

    type: Number,

    name: String,

    desc: String,

    //先执行优先级 越大越优先 web规则(3000~3999) > Store|源规则(2000~2999) > 具体页面规则(1000~1999) > 具体内容规则(0~999)
    priority: Number,

    //重要性  越大越优先  具体内容规则(3000~3999)>具体页面规则(1000~1999)  >Store|源规则(2000~2999)  > web规则(0~999)
    importance: Number,

    //获取范围
    scope: String,

    //获取目标
    target: String,

    //目标类型 ['html','DOM','TXT','JS','API','TAG']
    targetType: Number,

    //规则表达式
    expression: String,
    //规则状态 0：未生效；1：正常；-1：异常；
    status: Number,
    children: [String],

    createTime?: Date,
    updateTime?: Date,
}
