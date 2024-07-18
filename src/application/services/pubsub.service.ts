import { Injectable } from '@nestjs/common';
import { PubSubConfigService } from 'src/infrastructure/config/pubsub.config';

@Injectable()
export class PubsubService {
    private nameSubscription : "projects/challenge-users/subscriptions/testsub"

    constructor(private readonly _pubsub: PubSubConfigService){
    }
    async onModuleInit() {
        this.initSub()
    }

    async initSub(){
        try {
            const subscription = this._pubsub.getPubSubClient().subscription("projects/challenge-users/subscriptions/testsub")
            subscription.on('message', this.handleMessage);
        } catch (error) {
            console.log("erro", error);
        }
    }

    handleMessage(message) {
        try {
            console.log('Received message:', message.data.toString());
            message.ack();
        } catch (error) {
            console.log("erro", error);
        }
    }
      
    async publishMessage(body) {
        const dataBuffer = Buffer.from(body);
        try {
            const messageId = await this._pubsub.getPubSubClient().topic('projects/challenge-users/topics/testpubsub').publish(dataBuffer);
            console.log(`Message ${messageId} published.`);
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}`);
        }
    }
}
