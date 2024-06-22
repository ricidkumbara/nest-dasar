import { 
    Body,
    Controller, 
    Get, 
    Header, 
    HttpCode, 
    HttpRedirectResponse, 
    Inject, 
    Param, 
    ParseIntPipe, 
    Post, 
    Query, 
    Redirect, 
    Req, 
    Res, 
    UseFilters,
    UseGuards,
    UseInterceptors,
    UsePipes
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';

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
        private memberService: MemberService,
    ) {};

    @Get('/current')
    // @UseGuards(new RoleGuard(['admin', 'operator']))
    // @UseGuards(RoleGuard)
    @Roles(['admin','operator'])
    current(@Auth() user: User): Record<string, any> {
        return {
            data: `Hello ${user.name}`
        }
    }

    /* @Post('/login')
    @UseFilters(ValidationFilter)
    login(@Body(new ValidationPipe(loginUserRequestValidation)) request: LoginUserRequest) {
        return `Hello ${request.username}`;
    } */

    @Post('/login')
    @UsePipes(new ValidationPipe(loginUserRequestValidation))
    @UseFilters(ValidationFilter)
    @UseInterceptors(TimeInterceptor)
    @Header('Content-Type', 'application/json')
    login(@Query('name') name: string, @Body() request: LoginUserRequest) {
        return { data: `Hello ${request.username}` };
    }

    @Get('/connection')
    async getConnection(): Promise<string> {
        // this.userRepository.save();
        this.mailService.send();
        this.emailService.send();

        console.log(this.memberService.getConnectionName());
        this.memberService.sendMail();
    
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

    @Get('/create')
    async create(@Query('name') name: string, @Query('email') email: string): Promise<User> { 
        return this.userRepository.save(name, email);
    }

    @Get('/hello')
    sayHello(@Query('name') name: string, @Query('age') age: string): string { 
        return `Hello ${name}, your age ${age}`;
    }

    @Get('/hello2')
    // @UseFilters(ValidationFilter)
    async sayHello2(@Query('name') name: string, @Query('age') age: string): Promise<string> { 
        return this.service.sayHello(name, age);
    }

    /* @Get('/hello')
    async sayHello(@Query('name') name: string, @Query('age') age: string): Promise<string> { 
        return `Hello ${name}, your age ${age}`;
    } */

    @Get('/:id')
    getById(@Param('id', ParseIntPipe) id: number): string { 
        console.log(id * 10);
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
