import * as mongoose from 'mongoose';
// import * as Joi from '@hapi/joi'

// const STORE_SCKEMA_OBJECT=Joi.object({
//     type:Joi.number().default(1),
//     context:Joi.string()
// })


export const StoreSchema = new mongoose.Schema({
    //内容类型 1：文字；2：html格式；3：josn；4：图片；5：url
    type: Number,
    context: { type: String, required: true },
    comefrom: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});
// const StoreModel = mongoose.model('Store',StoreSchema)
