import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { ConfigModule } from '@nestjs/config';
import { configurationEnv } from './configuration';
import { FirebaseConfigService } from './infrastructure/config/firebase.config';
import { UserService } from './application/services/user.service';
import { FirebaseService } from './infrastructure/services/firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[configurationEnv],
    }),
  ],
  controllers: [UserController],
  providers: [UserService,FirebaseConfigService,FirebaseService],
  exports: [FirebaseConfigService]
})
export class AppModule {}
