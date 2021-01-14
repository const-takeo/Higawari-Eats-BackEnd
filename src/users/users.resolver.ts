import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateAccountInput,
  CreateAccountOutPut,
} from './dtos/create-accounts.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((type) => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((type) => String)
  hello(): string {
    return 'Hello';
  }

  @Mutation((type) => CreateAccountOutPut)
  createAccount(
    @Args('input') createAccountDto: CreateAccountInput,
  ): Promise<{ ok: boolean; error?: string }> {
    return this.usersService.createAccount(createAccountDto);
  }

  @Mutation((type) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((type) => UserEntity)
  @UseGuards(AuthGuard)
  me(@Context() context) {
    return context.user;
  }
}
