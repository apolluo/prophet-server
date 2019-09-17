import { Connection } from 'mongoose';
import { StoreSchema } from './schemas/store.sckema';

export const StoreProviders = [
    {
        provide: 'STORE_MODEL',
        useFactory: (connection: Connection) => connection.model('Store', StoreSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
