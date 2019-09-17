import { Connection } from "mongoose";
import { TagSchema } from "./schemas/tag.schema";


export const TagProviders = [
    {
        provide: 'TAG_MODEL',
        useFactory: (connection: Connection) => connection.model('Tag', TagSchema),
        inject: ['DATABASE_CONNECTION']
    },
]