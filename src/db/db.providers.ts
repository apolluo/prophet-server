import * as mongoose from 'mongoose';

const DATABASE_PATH='9.134.2.47:27017'
// const DATABASE_PATH='localhost'
const username='root'
const password=123456
export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>{
            mongoose.connection.on("connected", () => {
                console.log("mongodb数据库连接成功")
            });
            mongoose.connection.on("error", (error) => {
                console.log("mongodb数据库连接失败", error)
            });
            return mongoose.connect(`mongodb://${username}:${password}@${DATABASE_PATH}/nest?authSource=admin`, {
                useNewUrlParser: true, useUnifiedTopology: true
            });
        } 
    },
];
