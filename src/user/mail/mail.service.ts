import { Injectable } from '@nestjs/common';

export class MailService {
    send() {
        console.log('Send mail');
    }
}

export const mailService = new MailService();
