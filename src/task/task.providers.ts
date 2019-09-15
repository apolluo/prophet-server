import { Connection } from 'mongoose';
import { TaskSchema } from './schemas/task.sckema';

export const TaskProviders = [
    {
        provide: 'TASK_MODEL',
        useFactory: (connection: Connection) => connection.model('Task', TaskSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
