import * as mongoose from 'mongoose';
// import * as Joi from '@hapi/joi'

// const STORE_SCKEMA_OBJECT=Joi.object({
//     type:Joi.number().default(1),
//     context:Joi.string()
// })


export const StoreSchema = new mongoose.Schema({
    //context类型 1：文字；2：html格式；3：josn；4：图片；5：url; 6:本地
    type: Number,
    //名称 
    name: String,
    title: String,
    author: String,
    des: String,
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    context: String,
    comefrom:String,
    comefromDomain:String,
    comefromUrl: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
}, {
    collection: 'store', versionKey: false, timestamps: true
});
// const StoreModel = mongoose.model('Store',StoreSchema)
