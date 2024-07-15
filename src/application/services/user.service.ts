import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/services/firebase.service';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        private readonly firebaseService: FirebaseService,
    ) {}

    /**
     * Creates a new user.
     * @param user The user object to be created.
     * @returns A Promise that resolves to an HttpException if the user is created successfully, or an InternalServerErrorException if an error occurs.
     */
    async createUser(user: User) {
        try {
            const authUser = await this.firebaseService.authCreateUser(user);
            user.id = authUser.uid;
            await this.firebaseService.addDocumentWithID('users', user);
            return new HttpException('Usuario creado correctamente', HttpStatus.ACCEPTED)
        } catch (error) {
            return new InternalServerErrorException(error);
        }

    }
}
