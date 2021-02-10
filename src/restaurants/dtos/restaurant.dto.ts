import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class RestaurantInput {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
  @Field((type) => RestaurantEntity, { nullable: true })
  restaurant?: RestaurantEntity;
}
