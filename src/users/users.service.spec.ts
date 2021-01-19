import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// fake functionを作る、mock function
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});
// mock func of jwt
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};
// mock func of mail
const mockMailService = {
  sendVerificationEmail: jest.fn(),
};
// mock repository of UserEntity
type mockUsersRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

//jest
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: mockUsersRepository<UserEntity>;
  // 全てをテストする前にモジュールを作る。
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      //モジュールにimportしたいことを書く
      providers: [
        UsersService,
        //mockRepository => typeOrmで本当のrepositoryを呼び出すのではなく偽物を作る。
        {
          //repositoryの場合getRepositoryTokenを利用して誤魔化す
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
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
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  // 一つ目のテスト
  it('be defined', () => {
    expect(service).toBeDefined();
  });
  //
  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'mock@mock.com',
      password: '1234',
      role: 0,
    };
    //
    it('should be fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        email: 'mock@mock.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'Already Exists',
      });
    });
    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createAccountArgs);
      userRepository.save.mockResolvedValue(createAccountArgs);
      await service.createAccount(createAccountArgs);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs);
    });
  });
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
