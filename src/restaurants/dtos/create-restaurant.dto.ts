import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(
  RestaurantEntity,
  ['address', 'name', 'coverImg'],
  InputType,
) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
  @Field((type) => Int)
  restaurantId?: number;
}
