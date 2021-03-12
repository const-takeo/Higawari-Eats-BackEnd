import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutPut,
} from './dtos/create-accounts.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserEntity } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  //create accounts
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutPut> {
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
      const verification = await this.verificationRepository.save(
        this.verificationRepository.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Couldn't Create Account",
      };
    }
  }

  // login
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // check the user
    try {
      // Specifies what columns should be retrieved. <- select option
      const user = await this.usersRepository.findOne(
        { email },
        { select: ['password', 'id'] },
      );
      if (!user) {
        return {
          ok: false,
          error: 'You Should Create a Account',
        };
      }
      const { ok, error } = await user.checkPassword(password);
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  // findById
  async findById(id: number): Promise<UserProfileOutput> {
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
  //editProfileInputをdestructuringを使ってemail,passwordを探そうとすると値がない時undefinedになってしまう。
  //editProfileInputをobjectを投げてnullable状態にする。
  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const findUser = await this.usersRepository.findOne(id);
      if (email) {
        findUser.email = email;
        findUser.verified = false;
        await this.verificationRepository.delete({
          user: { id: findUser.id },
        });
        const verification = await this.verificationRepository.save(
          this.verificationRepository.create({
            user: findUser,
          }),
        );
        this.mailService.sendVerificationEmail(
          findUser.email,
          verification.code,
        );
      }
      if (password) {
        findUser.password = password;
      }
      await this.usersRepository.save(findUser);
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

  // verifyEmail
  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verificationRepository.findOne(
        { code },
        // verification entityと関連付けられているuser entityを呼びます。
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        await this.usersRepository.save(verification.user);
        await this.verificationRepository.delete(verification.id);
        return {
          ok: true,
        };
      }
      return {
        ok: false,
        error: 'Verification not found',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
