import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(
  UserEntity,
  ['email', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class CreateAccountOutPut {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}
