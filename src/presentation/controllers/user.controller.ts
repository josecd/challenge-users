import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from 'src/application/services/user.service';
import { User } from 'src/domain/entities/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    async createUser(
        @Body() body: User
    ) {
        return this.userService.createUser(body);
    }
}
