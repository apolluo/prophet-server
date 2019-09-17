import { Controller, Put, Body,Get } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('store')
export class StoreController {
    constructor(private readonly storeService:StoreService){

    }
    @Put('/add')
    addStore(@Body() createStoreDto:CreateStoreDto){
        this.storeService.create(createStoreDto)
    }
    @Get()
    findAll(){
        return this.storeService.findAll()
    }
}
