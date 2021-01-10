import { Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((type) => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((type) => String)
  hello(): string {
    return 'Hello';
  }
}
