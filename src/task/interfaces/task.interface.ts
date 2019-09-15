import { Document } from 'mongoose';

export interface ITask extends Document {
    readonly name: string;
    readonly age: number;
    readonly breed: string;
}
