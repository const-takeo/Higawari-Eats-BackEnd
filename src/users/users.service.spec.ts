import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

//jest
describe('UsersService', () => {
  let service: UsersService;
  // 全てをテストする前にモジュールを作る。
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      //モジュールにimportしたいことを書く
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  // 一つ目のテスト
  it('be defined', () => {
    expect(service).toBeDefined();
  });
  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
