import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends OmitType(
  RestaurantEntity,
  ['id', 'category', 'owner'],
  InputType,
) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
