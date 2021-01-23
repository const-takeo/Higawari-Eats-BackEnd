import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  //test後閉じ無いとエラが起こる。
  afterAll(async () => {
    //testが終わるとDBをdropする。
    await getConnection().dropDatabase();
    app.close();
  });
  //todo
  //testの順番を付けるのは重要。
  it.todo('createAccount');
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
