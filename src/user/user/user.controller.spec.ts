import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserModule } from '../user.module';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be say hello', async () => {
    const response = await controller.sayHello('Ricid', '25');
    expect(response).toBe(`Hello Ricid, your age 25`);
  });

  it('Should can view template', () => {
    const response = httpMock.createResponse();
    controller.viewHello('Ricid', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      name: 'Ricid',
      title: 'Template Engine',
    });
  });

});
