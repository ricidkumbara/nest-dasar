import { 
    Controller, 
    Get, 
    Header, 
    HttpCode, 
    HttpRedirectResponse, 
    Inject, 
    Param, 
    Post, 
    Query, 
    Redirect, 
    Req, 
    Res 
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';

@Controller('/api/users')
export class UserController {
    // Inject using property based
    /* @Inject()
    @Optional // jika tidak wajib
    private userService: UserService; */

    // Inject using constructor
    constructor (
        private service: UserService, 
        private connection: Connection, 
        private mailService: MailService,
        @Inject('EmailService') private emailService: MailService,
        private userRepository: UserRepository,
    ) {};

    @Get('/connection')
    async getConnection(): Promise<string> {
        this.userRepository.save();
        this.mailService.send();
        this.emailService.send();
        return this.connection.getName();
    }

    @Get('/view/hello')
    viewHello(@Query('name') name: string, @Res() response: Response) {
        response.render('index.html', {
            title: 'Template Engine',
            name: name,
        });
    }

    @Get('/set-cookie')
    setCookie(@Query('name') name: string, @Res() response: Response) {
        response.cookie('name', name);
        response.status(200).send('Set cookie success');
    }

    @Get('/get-cookie')
    getCookie(@Req() request: Request) {
        return request.cookies['name'];
    }

    /* @Get('/sample-response')
    sampleResponse(@Res() response: Response) {
        response.status(200).send('Sample Response');
    } */

    @Get('/sample-response')
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    sampleResponse(): Record<string, string> {
        return {
            data: 'Hello JSON'
        };
    }

    @Get('/redirect')
    @Redirect()
    redirect(): HttpRedirectResponse {
        return {
            url: '/api/users/sample-response',
            statusCode: 301
        };
    }

    @Get('/hello')
    sayHello(@Query('name') name: string, @Query('age') age: string): string { 
        return `Hello ${name}, your age ${age}`;
    }

    // @Get('/hello')
    // async sayHello(@Query('name') name: string, @Query('age') age: string): Promise<string> { 
    //     return this.service.sayHello('Ricid', '25');
    // }

    /* @Get('/hello')
    async sayHello(@Query('name') name: string, @Query('age') age: string): Promise<string> { 
        return `Hello ${name}, your age ${age}`;
    } */

    @Get('/:id')
    getById(@Param('id') id: string): string { 
        return `GET ${id}`;
    }

    /* Menuggunkan cara ini (Express Req) kurang disarankan
    @Get('/:id')
    getById(@Req() request: Request): string { 
        return `GET ${request.params.id}`;
    } */

    @Post()
    post(): string {
        return 'POST';
    }

    @Get()
    get(): string {
        return 'GET';
    }
}
