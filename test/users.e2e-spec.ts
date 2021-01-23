import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const GRAPHQL_ENDPOINT = '/graphql';
//
jest.mock('got', () => {
  console.log('Jest fucking awesome');
  post: jest.fn();
});

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
  describe('createAccount', () => {
    const TEST_EMAIL = 'e2e@test.com';
    it('should create account', () => {
      //supertestを用いてrequestをgraphqlに送る。
      //graphqlはpost requestの包み
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            createAccount(input:{
              email:"${TEST_EMAIL}"
              password:"1234"
              role:Owner
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
    //fail
    it('should fail if exists account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            createAccount(input:{
              email:"${TEST_EMAIL}"
              password:"1234"
              role:Owner
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });
  //
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
