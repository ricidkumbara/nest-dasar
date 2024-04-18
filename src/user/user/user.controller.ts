import { 
    Controller, 
    Get, 
    Header, 
    HttpCode, 
    HttpRedirectResponse, 
    Param, 
    Post, 
    Query, 
    Redirect, 
    Req, 
    Res 
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/api/users')
export class UserController {

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

    /* @Get('/hello')
    sayHello(@Query('name') name: string, @Query('age') age: string): string { 
        return `Hello ${name}, your age ${age}`;
    } */

    @Get('/hello')
    async sayHello(@Query('name') name: string, @Query('age') age: string): Promise<string> { 
        return `Hello ${name}, your age ${age}`;
    }

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
