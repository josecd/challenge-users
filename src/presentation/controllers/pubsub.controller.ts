import { Body, Controller, Post } from '@nestjs/common';
import { PubsubService } from 'src/application/services/pubsub.service';

@Controller("pubsub")
export class PubsubController {
    constructor(
        private readonly _pubsub:PubsubService
    ){}

    @Post("public-msg")
    async publicMsg(
        @Body() body:{text:string}
    ) {
        return this._pubsub.publishMessage(body.text)
    }
 }
