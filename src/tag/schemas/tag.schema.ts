import * as mongoose from 'mongoose';


export const TagSchema = new mongoose.Schema({
    //Tag类型 
    type:Number,
    label:String,
    stores:[{type:mongoose.Schema.Types.ObjectId,ref:'store'}]

});
// const TagModel = mongoose.model('Tag',TagSchema)
//  {
//     TagModel,
//     TagSchema
// }
