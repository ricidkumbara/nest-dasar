import { Inject, Injectable } from '@nestjs/common';
import { Connection } from '../connection/connection';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserRepository {
    // connection: Connection;

    // save() {
    //     console.log(`Save user with connection ${this.connection.getName()}`);
    // }

    constructor (
        private prismaService: PrismaService, 
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
    ) {
        console.log('Create user repository');
    }

    async save(name: string, email: string) {
        this.logger.info(`create user ${name} | ${email}`);

        return this.prismaService.user.create({
            data: {
                name: name,
                email: email,
                password: 'SECRET',
            }
        });
    }

}

// export function createUserRepository(connection: Connection): UserRepository {
//     const repository = new UserRepository();
//     repository.connection = connection;
//     return repository;
// }