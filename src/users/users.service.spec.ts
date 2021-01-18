import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { UserEntity } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// fake functionを作る、mock function
const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};
// mock func of jwt
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};
// mock func of mail
const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

//jest
describe('UsersService', () => {
  let service: UsersService;
  // 全てをテストする前にモジュールを作る。
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      //モジュールにimportしたいことを書く
      providers: [
        UsersService,
        //mockRepository => typeOrmで本当のrepositoryを呼び出すのではなく偽物を作る。
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
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
