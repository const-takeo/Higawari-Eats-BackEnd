import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-accounts.dto';
import { LoginInput } from './dtos/login.dto';
import { UserEntity } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  //create accounts
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      console.log(email, { email });
      const exists = await this.usersRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: 'Already Exists',
        };
      }
      await this.usersRepository.save(
        this.usersRepository.create({ email, password, role }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
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
      const token = jwt.sign(
        { id: user.id },
        this.configService.get('PRIVATE_KEY'),
      );
      const { ok, error } = await user.checkPassword(password);
      if (ok) {
        return {
          ok,
          token,
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
}
