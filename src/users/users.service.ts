import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-accounts.dto';
import { LoginInput } from './dtos/login.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
      const user = this.usersRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'You Should Create a Account',
        };
      }
      return (await user).checkPassword(password);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
