import { SchedulerGoogleService } from 'src/infrastructure/services/scheduler.service';
import { SchedulerService } from './../../application/services/scheduler.service';
import { SchedulerController } from './../controllers/scheduler.controller';
import { Module } from '@nestjs/common';
import { SchedulerConfigService } from 'src/infrastructure/config/schedulerconfig';

@Module({
    imports: [],
    controllers: [
        SchedulerController
    ],
    providers: [
        SchedulerService,
        SchedulerGoogleService,
        SchedulerConfigService
    ],
})
export class SchedulerModule { }
