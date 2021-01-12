import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutPut,
} from './dtos/create-accounts.dto';
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
    console.log(createAccountDto);
    return this.usersService.createAccount(createAccountDto);
  }
}
