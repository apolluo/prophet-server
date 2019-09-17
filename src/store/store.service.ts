import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { IStore } from './interfaces/store.interface';
@Injectable()
export class StoreService {
    constructor(
        @Inject('STORE_MODEL')
        private readonly StoreModel:Model<IStore>
    ){}
    async create(createStoreDto){
        const createStore = new this.StoreModel(createStoreDto)
        return await createStore.save()
    }
    async findAll(){
        return await this.StoreModel.find().exec() 
    }
}
