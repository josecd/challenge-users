import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubConfigService implements OnModuleInit {
    private pubSubClient

    async onModuleInit() {
        this.pubSubClient = new PubSub({
            projectId: process.env.project_id,
            credentials: {
                client_email: process.env.client_email,
                private_key: process.env.private_key.replace(/\\n/g, '\n')
              }
          });
    }

    getPubSubClient() {
        return this.pubSubClient
    }

}