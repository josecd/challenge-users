export interface CreateScheduleTaskI {
    projectNameCloud?:string;
    location?:string;
    jobName?:string;
    minutesAction: number;
    httpTarget: HttpTargetTaskI;

    idTemplate?:string;
}

export interface UpdateScheduleTaskI {
    projectNameCloud:string;
    location:string;
    jobName:string;
    minutesAction: number;
    httpTarget: HttpTargetTaskI
}

export interface DeleteScheduleTaskI{
    projectNameCloud:string;
    location:string;
    jobName:string;
}

export interface SmsScheduleTaskI{
    location:string;
    to:string;
    from:string;
    message:string;
    jobNameSchedule:string;
}

export interface SmsGlucosacheduleI{
    name:string;
    to:string;
}

interface HttpTargetTaskI {
    uri:string,
    method:string,
    body:any
}
