import { Module } from '@nestjs/common';
import { UserService } from 'src/application/services/user.service';
import { FirebaseConfigService } from 'src/infrastructure/config/firebase.config';
import { FirebaseService } from 'src/infrastructure/services/firebase.service';
import { UserController } from '../controllers/user.controller';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [
        UserService, 
        FirebaseConfigService, 
        FirebaseService,
    ],
})
export class UserModule {}
