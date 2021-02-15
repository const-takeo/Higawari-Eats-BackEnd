import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { DishOptions } from 'src/restaurants/entities/dish.entity';

@InputType()
class CreateOrderItemInput {
  @Field((type) => Int)
  dishId: number;

  @Field((type) => DishOptions, { nullable: true })
  options?: DishOptions[];
}

@InputType()
export class CreateOrderInput {
  @Field((type) => Int)
  restaurantId: number;

  @Field((type) => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
