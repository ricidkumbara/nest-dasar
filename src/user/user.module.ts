import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, MongoDBConnection, MySQLConnection, createConnection } from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import { UserRepository /* createUserRepository */ } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [/* PrismaModule */],
  controllers: [UserController],
  providers: [
    UserService, 
    // {
    //   provide: Connection,
    //   useClass: process.env.DATABASE == 'mysql' ? MySQLConnection : MongoDBConnection
    // },
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    }, 
    {
      provide: MailService,
      useValue: mailService
    }, 
    {
      provide: "EmailService",
      useExisting: MailService
    },
    // {
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [Connection]
    // },
    UserRepository,
    MemberService
  ],
  exports: [UserService],
})
export class UserModule {}
