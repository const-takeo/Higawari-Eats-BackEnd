import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-accounts.dto';
import { LoginInput } from './dtos/login.dto';
import { UserEntity } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  //create accounts
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      // check
      const exists = await this.usersRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: 'Already Exists',
        };
      }
      // create user
      const user = await this.usersRepository.save(
        this.usersRepository.create({ email, password, role }),
      );
      // create verification
      await this.verificationRepository.save(
        this.verificationRepository.create({
          user,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  // login
  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // check the user
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'You Should Create a Account',
        };
      }
      const token = this.jwtService.sign(user.id);
      const { ok, error } = await user.checkPassword(password);
      console.log(ok, error);
      if (ok) {
        return {
          ok,
          token,
          error,
        };
      } else {
        return {
          ok,
          error,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  // findById
  async findById(
    id: number,
  ): Promise<{ user?: UserEntity; ok: boolean; error?: string }> {
    try {
      const user = await this.usersRepository.findOne({ id });
      if (user !== undefined) {
        return {
          user,
          ok: true,
        };
      } else {
        throw Error();
      }
    } catch (error) {
      return {
        ok: false,
        error: 'User Not Found',
      };
    }
  }

  // editProfile
  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): //editProfileInputをdestructuringを使ってemail,passwordを探そうとすると値がない時undefinedになってしまう。
  //editProfileInputをobjectを投げてnullable状態にする。
  Promise<{ ok: boolean; error?: string; user?: UserEntity }> {
    try {
      const findUser = await this.usersRepository.findOne(id);
      if (email) {
        findUser.email = email;
        findUser.verified = false;
        await this.verificationRepository.save(
          this.verificationRepository.create({
            user: findUser,
          }),
        );
      }
      if (password) {
        findUser.password = password;
      }
      const result = await this.usersRepository.save(findUser);
      return {
        ok: true,
        user: result,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  // verifyEmail
  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verificationRepository.findOne(
      { code },
      { relations: ['user'] },
    );
    if (verification) {
      verification.user.verified = true;
      this.usersRepository.save(verification.user);
    }
    return false;
  }
}
