import { InputType, OmitType } from '@nestjs/graphql';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  RestaurantEntity,
  ['id'],
  InputType,
) {}
