import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class MyRestaurantInput extends PickType(RestaurantEntity, ['id']) {}

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
  @Field(() => RestaurantEntity, { nullable: true })
  restaurant?: RestaurantEntity;
}
