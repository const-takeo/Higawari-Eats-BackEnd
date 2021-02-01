import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutPut,
} from './dtos/create-accounts.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((type) => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((type) => CreateAccountOutPut)
  createAccount(
    @Args('input') createAccountDto: CreateAccountInput,
  ): Promise<CreateAccountOutPut> {
    return this.usersService.createAccount(createAccountDto);
  }

  @Mutation((type) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((type) => UserEntity)
  @Role(['Any'])
  me(@AuthUser() authUser: UserEntity) {
    return authUser;
  }

  @Query((type) => UserProfileOutput)
  @Role(['Any'])
  @UseGuards(AuthGuard)
  async userProfile(
    @Args('input') { id }: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return await this.usersService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Mutation((type) => EditProfileOutput)
  async editProfile(
    @AuthUser() { id }: UserEntity,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return await this.usersService.editProfile(id, editProfileInput);
  }

  @Mutation((type) => VerifyEmailOutput)
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(code);
  }
}
