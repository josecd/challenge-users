export interface CreateScheduleI {
    projectNameCloud?:string;
    location?:string;
    jobName?:string;
    minutesAction: number;
    httpTarget: HttpTargetI
}

export interface UpdateScheduleI {
    projectNameCloud:string;
    location:string;
    jobName:string;
    minutesAction: number;
    httpTarget: HttpTargetI
}

export interface DeleteScheduleI{
    projectNameCloud:string;
    location:string;
    jobName:string;
}

export interface SmsScheduleI{
    location:string;
    to:string;
    from:string;
    message:string;
}

interface HttpTargetI {
    uri:string,
    method:string,
    body:any
}
