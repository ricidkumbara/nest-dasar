import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    sayHello(name: string, age: string): string {
        return `Hello ${name}, your age ${age}`;
    }
}
