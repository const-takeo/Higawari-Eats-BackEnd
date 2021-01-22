import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { resolve } from 'path';
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
  delete: jest.fn(),
});
// mock func of jwt
const mockJwtService = () => ({
  sign: jest.fn(() => 'token-token-token'),
  verify: jest.fn(),
});
// mock func of mail
const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});
// mock repository of UserEntity
type mockUsersRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

//jest
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: mockUsersRepository<UserEntity>;
  let verificationRepository: mockUsersRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;
  // 全てをテストする前にモジュールを作る。
  beforeEach(async () => {
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
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  // 一つ目のテスト
  it('be defined', () => {
    expect(service).toBeDefined();
  });
  //createAccount
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
      //user
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createAccountArgs);
      userRepository.save.mockResolvedValue(createAccountArgs);
      //verification
      //userだけ用いてインスタンスが生成される。→ return値にcodeは無い。
      verificationRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationRepository.save.mockResolvedValue({
        code: 'mockCode',
        user: createAccountArgs,
      });
      //service
      const result = await service.createAccount(createAccountArgs);
      //user
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs);
      //verification
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      //mail
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      //service
      expect(result).toMatchObject({
        ok: true,
      });
    });
    //exception
    it('should fail if user exists', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const failed = await service.createAccount(createAccountArgs);
      expect(failed).toEqual({
        ok: false,
        error: "Couldn't Create Account",
      });
    });
  });
  //login
  describe('login', () => {
    const loginArgs = {
      email: 'mock@email.com',
      password: '1234',
    };
    //
    it('should fail if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'You Should Create a Account',
      });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
    });
    //Worng password
    it('should fail if password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => ({
          ok: false,
          error: new Error(),
        })),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: expect.any(Error) });
    });
    //
    it('should return token if password correct', async () => {
      const mockedReturnValue = {
        id: 1,
        checkPassword: jest.fn(() => ({
          ok: true,
        })),
      };
      userRepository.findOne.mockResolvedValue(mockedReturnValue);
      const result = await service.login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual({
        ok: true,
        token: expect.any(String),
      });
    });
    //
    it('should fail', async () => {
      userRepository.findOne.mockResolvedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: expect.any(Error),
      });
    });
  });
  //findById
  describe('findById', () => {
    it('should return user entity if user exist', async () => {
      const findUserArgs = {
        id: 1,
      };
      userRepository.findOne.mockResolvedValue(findUserArgs);
      const result = await service.findById(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        user: findUserArgs,
        ok: true,
      });
    });
    //
    it('should fail if user not exist', async () => {
      // userRepository.findOne.mockRejectedValue(new Error());
      userRepository.findOne.mockResolvedValue(Promise.resolve(undefined));
      const result = await service.findById(1);
      expect(result).toEqual({
        ok: false,
        error: 'User Not Found',
      });
    });
  });
  //editProfile
  describe('editProfile', () => {
    it('should change the email', async () => {
      const editProfileArgs = {
        id: 1,
        args: { email: 'mock@mock.com' },
      };
      const mockUser = {
        id: 1,
        email: 'mock@test.com',
        verified: true,
      };
      const newUser = {
        id: 1,
        verified: false,
        email: editProfileArgs.args.email,
      };
      const mockVerification = {
        code: 'mockCode',
      };
      userRepository.findOne.mockResolvedValue(mockUser);
      verificationRepository.create.mockReturnValue(mockVerification);
      verificationRepository.save.mockResolvedValue(mockVerification);

      await service.editProfile(editProfileArgs.id, editProfileArgs.args);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(editProfileArgs.id);

      expect(verificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationRepository.delete).toHaveBeenCalledWith({
        user: { id: editProfileArgs.id },
      });
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationRepository.save).toHaveBeenCalledWith(
        mockVerification,
      );
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        mockVerification.code,
      );
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
    });
    //
    it('should change the password', async () => {
      const changePasswordArgs = {
        id: 1,
        password: '1234',
      };
      const passwordMockUser = {
        password: changePasswordArgs.password,
      };
      userRepository.findOne.mockResolvedValue(passwordMockUser);
      const result = await service.editProfile(
        changePasswordArgs.id,
        changePasswordArgs,
      );
      expect(userRepository.save).toHaveBeenCalledWith(passwordMockUser);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: true,
      });
    });
    //
    it('should return any error', async () => {
      const editProfileArgs = {
        id: 1,
        args: { email: 'mock@mock.com' },
      };
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(
        editProfileArgs.id,
        editProfileArgs,
      );
      expect(result).toEqual({
        ok: false,
        error: expect.any(Error),
      });
    });
  });
  //
  it.todo('verifyEmail');
});
