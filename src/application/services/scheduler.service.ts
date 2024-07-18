import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateScheduleTaskI } from 'src/domain/interface/create-schedule.interface';
import { SchedulerGoogleService } from 'src/infrastructure/services/scheduler.service';

@Injectable()
export class SchedulerService {
    constructor(
        private _schedule: SchedulerGoogleService
    ){}

    async createScheduler(body: CreateScheduleTaskI) {
        try {
            const time = new Date().getTime();
            body.projectNameCloud = process.env.project_id;
            body.location = "us-central1";
            body.jobName = `${body.idTemplate}-${time}`
            const response = await this._schedule.createTask(body)
            return new HttpException(response, HttpStatus.OK);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    async deleteScheduler(jobName) {
        try {
            const projectName = process.env.project_id;
            const location = "us-central1";
            const response = await this._schedule.deleteTask(projectName, location, jobName)
            return new HttpException("Task eliminada", HttpStatus.OK);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
    
}
