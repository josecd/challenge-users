import { PubsubService } from './../../application/services/pubsub.service';
import { PubSubConfigService } from 'src/infrastructure/config/pubsub.config';
import { PubsubController } from './../controllers/pubsub.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        PubsubController
    ],
    providers: [
        PubSubConfigService,
        PubsubService, 
    ],
})
export class PubsubModule { }
