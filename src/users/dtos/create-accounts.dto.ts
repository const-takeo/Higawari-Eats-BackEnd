import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(
  UserEntity,
  ['email', 'password', 'role', 'address'],
  InputType,
) {}

@ObjectType()
export class CreateAccountOutPut extends CoreOutput {}
