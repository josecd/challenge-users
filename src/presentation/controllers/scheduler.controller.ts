import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { SchedulerService } from 'src/application/services/scheduler.service';
import { CreateScheduleTaskI } from 'src/domain/interface/create-schedule.interface';

@Controller("scheduler")
export class SchedulerController {

    constructor(private readonly _scheduler: SchedulerService) {
    }

    @Post("create-task")
    async createScheduer(
        @Body() body:CreateScheduleTaskI
    ) {
        return this._scheduler.createScheduler(body);
    }

    @Patch("editar")
    async udpateScheduler(
        @Body() body:CreateScheduleTaskI
    ){
        return this._scheduler.createScheduler(body)
    }

    @Delete("eliminar/:jobName")
    async deleteTask(
        @Param('jobName') jobName, 
    ){
        return this._scheduler.deleteScheduler(jobName)

    }
 }
