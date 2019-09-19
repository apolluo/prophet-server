import { ApiModelProperty } from '@nestjs/swagger';
export class UpdateRuleDto {
    //规则类型 {name:'type',enum:['web规则','Store规则', '源规则','具体页面规则','具体内容规则']}
    @ApiModelProperty()
    readonly type: Number;
    @ApiModelProperty()
    readonly name: String;
    @ApiModelProperty()
    readonly desc: String;
    @ApiModelProperty()
    //先执行优先级 越大越优先 web规则(3000~3999) > Store|源规则(2000~2999) > 具体页面规则(1000~1999) > 具体内容规则(0~999)
    readonly priority: Number;
    @ApiModelProperty()
    //重要性  越大越优先  具体内容规则(3000~3999)>具体页面规则(1000~1999)  >Store|源规则(2000~2999)  > web规则(0~999)
    readonly importance: Number;
    @ApiModelProperty()
    //获取范围
    readonly scope: String;
    @ApiModelProperty()
    //获取目标
    readonly target: String;
    @ApiModelProperty()
    //目标类型 ['html','DOM','TXT','JS','API','TAG']
    readonly targetType: Number;
    @ApiModelProperty()
    //规则表达式
    readonly expression: String;
    //规则状态 0：未生效；1：正常；-1：异常；
    @ApiModelProperty()
    readonly status: Number;
    // @ApiModelProperty()
    // readonly createTime: Date;
    // @ApiModelProperty()
    // readonly updateTime: Date;
}


