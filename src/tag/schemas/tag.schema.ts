import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';


export const TagSchema = new mongoose.Schema({
    //Tag类型 
    type: Number,
    //标签
    label: String,
    //判断方式
    match: [String],
    //所属根TAG，如果没有，则为根TAG
    root: String,
    children: [{ type: ObjectId, ref: 'Tag' }],
    //该TAG包含的文章
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }]
});
// const TagModel = mongoose.model('Tag',TagSchema)
//  {
//     TagModel,
//     TagSchema
// }
