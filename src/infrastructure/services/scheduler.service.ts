import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { google } from "googleapis";
import { SchedulerConfigService } from '../config/schedulerconfig';
import { UpdateScheduleI } from 'src/domain/interface/create-schedule-cloud.interface';

export interface CreateScheduleI {
    projectNameCloud?:string;
    location?:string;
    jobName?:string;
    minutesAction: number;
    httpTarget: HttpTargetI
}
interface HttpTargetI {
    uri:string,
    method:string,
    body:any
}

@Injectable()
export class SchedulerGoogleService {

    constructor(private readonly _scheduler:SchedulerConfigService) {
    }
    
    onModuleInit() {
    }

    /**
     * Create google cloud scheduler.
     * @example
     * httpTarget;{
     * "uri":"https://apites.com/",
     * "method":"POST", //GET, POST, etc
     * "body":{ "value": "test"}
     * }
     * @returns 
     */
    async createTask(body: CreateScheduleI) {
        try {

            const scheduler =  google.cloudscheduler('v1');
            const job = {
                name: `projects/${body.projectNameCloud}/locations/${body.location}/jobs/${body.jobName}`,
                schedule: await this.generarExpresionCron(body.minutesAction),
                timeZone: 'UTC',
                httpTarget: {
                    uri: body.httpTarget.uri,
                    httpMethod: body.httpTarget.method,
                    body: Buffer.from(JSON.stringify(body.httpTarget.body)).toString('base64'),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            };

            const response = await scheduler.projects.locations.jobs.create({
                requestBody: job,
                auth: this._scheduler.getAuth(),
                parent: `projects/${body.projectNameCloud}/locations/${body.location}`,
            });
            console.log('Respuesta de la API:', response.data);
            return response.data
        } catch (error) {
            return new HttpException(`Error al crear la tarea programada: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    };

    async deleteTask(projectName, location, jobName) {
        try {
            const scheduler = google.cloudscheduler('v1');
            const dataReturn = await scheduler.projects.locations.jobs.delete({
                auth: this._scheduler.getAuth(),
                name: `projects/${projectName}/locations/${location}/jobs/${jobName}`,
            });
            console.log('Respuesta de la API:', dataReturn.data);
            return new HttpException('Tarea programada eliminada correctamente', HttpStatus.ACCEPTED);            
        } catch (error) {
            console.error('Error al eliminar la tarea programada:', error);
            return new HttpException(`Error al eliminar la tarea programada: ${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }

    generarExpresionCron(minutos) {
        const ahora = new Date();
        const horaActual = ahora.getUTCHours();
        const minutosActuales = ahora.getUTCMinutes()
        let dia = new Date().getUTCDate();
        let mes = new Date().getUTCMonth() + 1;
        if (minutos < 1) {
            throw new Error('Los minutos deben ser mayores o iguales a 1.');
        }
        if (minutos > 59) {
            let horasExtra = Math.floor(minutos / 60);
            minutos = minutos % 60;
            let horaEnElFuturoTemporal = (horaActual + Math.floor((minutosActuales + minutos) / 60) + horasExtra) % 24;
            let minutosEnElFuturoTemporal = (minutosActuales + minutos) % 60;
            if (horaEnElFuturoTemporal < horaActual) {
                dia = (dia % new Date(ahora.getFullYear(), mes, 0).getDate()) + 1;
                if (dia === 1) {
                    mes = (mes % 12) + 1;
                }
            }
            return `${minutosEnElFuturoTemporal} ${horaEnElFuturoTemporal} ${dia} ${mes} *`;
        }
        const minutosEnElFuturo = (minutosActuales + minutos) % 60;
        const horaEnElFuturo = (horaActual + Math.floor((minutosActuales + minutos) / 60)) % 24;
        return `${minutosEnElFuturo} ${horaEnElFuturo} ${dia} ${mes} *`;
    }


    validarObjeto(objeto) {
        return new Promise<void>((resolve, reject) => {
            for (var campo in objeto) {
                if (objeto.hasOwnProperty(campo)) {
                    const result = this.validarCampo(objeto[campo], campo);
                    if (result instanceof HttpException) {
                        reject(result);
                        return;
                    }
                }
            }
            resolve();
        });
    }

    validarCampo(valor, nombreCampo) {
        if (valor.trim() !== "") {
            // console.log(`El campo '${nombreCampo}' no está vacío.`);
            return null;
        } else {
            return new HttpException(`El campo '${nombreCampo}' está vacío.`, HttpStatus.BAD_REQUEST);
        }
    }

}
