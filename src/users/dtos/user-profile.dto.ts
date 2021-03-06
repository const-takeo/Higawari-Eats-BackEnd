import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CoreEntity } from 'src/common/entities/common.entity';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class UserProfileInput extends PickType(CoreEntity, ['id'], InputType) {}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => UserEntity, { nullable: true })
  user?: UserEntity;
}
