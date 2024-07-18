import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { google } from "googleapis";

@Injectable()
export class SchedulerConfigService implements OnModuleInit {
    private auth

    async onModuleInit() {
         this.auth = await new google.auth.GoogleAuth({
            credentials: { 
                client_email: process.env.client_email,
                private_key: process.env.private_key.replace(/\\n/g, '\n')
            },
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
        });     
    }

    getAuth() {
        return this.auth;
    }

}