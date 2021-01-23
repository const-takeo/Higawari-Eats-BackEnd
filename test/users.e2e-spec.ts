import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const GRAPHQL_ENDPOINT = '/graphql';
//
const TEST_USER = {
  email: 'e2e@test.com',
  password: '1234',
};
//
jest.mock('got', () => {
  console.log('Jest fucking awesome');
  post: jest.fn();
});

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

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
    it('should create account', () => {
      //supertestを用いてrequestをgraphqlに送る。
      //graphqlはpost requestの包み
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            createAccount(input:{
              email:"${TEST_USER.email}"
              password:"${TEST_USER.password}"
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
              email:"${TEST_USER.email}"
              password:"${TEST_USER.password}"
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
  describe('login', () => {
    it('should login and take a token', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation{
          login(input:{
            email:"${TEST_USER.email}"
            password:"${TEST_USER.password}"
          }){
            error
            ok
            token
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { ok, error, token },
              },
            },
          } = res;
          jwtToken = token;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
        });
    });
    it('should not be able to login', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation{
          login(input:{
            email:"${TEST_USER.email}"
            password:"papapa"
          }){
            error
            ok
            token
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('Wrong Password');
          expect(token).toEqual(null);
        });
    });
  });
  it.todo('userProfile');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
