import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  RestaurantEntity,
  ['id'],
  InputType,
) {}
