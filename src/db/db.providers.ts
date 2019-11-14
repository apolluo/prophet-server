import * as mongoose from 'mongoose';
import { DATABASE_URI } from '@/config';

//devnet
// const DATABASE_PATH='9.134.2.47:27017'
// const DATABASE_PATH = 'localhost'
//money
// const DATABASE_PATH='139.155.53.64:27017'
// const username = 'apolluo'
// const password = 'xingxuan@1983'
export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> => {
            mongoose.connection.on("connected", () => {
                console.log("mongodb数据库连接成功")
            });
            mongoose.connection.on("error", (error) => {
                console.log("mongodb数据库连接失败", error)
            });
            // return mongoose.connect(`mongodb://${DATABASE_PATH}/nest?authSource=admin`, {
            //     user:username,
            //     pass:password,
            //     useNewUrlParser: true, 
            //     useUnifiedTopology: true
            // });
            return mongoose.connect(DATABASE_URI, {
                useNewUrlParser: true, useUnifiedTopology: true
            });
        }
    },
];
