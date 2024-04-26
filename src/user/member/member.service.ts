import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MemberService {
    // Module reference, kurang disarankan
    constructor(private moduleRef: ModuleRef) {}

    getConnectionName(): string {
        const connection = this.moduleRef.get(Connection);
        return connection.getName();
    }

    sendMail() {
        const mailService = this.moduleRef.get(MailService);
        mailService.send();
    }
}