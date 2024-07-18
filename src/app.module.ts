import { PubsubModule } from './presentation/modules/pubsub.module';
import { SchedulerModule } from './presentation/modules/scheduler.module';
import { UserModule } from './presentation/modules/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationEnv } from './configuration';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurationEnv],
    }),
    UserModule,
    SchedulerModule,
    PubsubModule, 
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule { }
