import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderEntity } from '../entities/order.entity';

@InputType()
export class CreateOrderInput extends PickType(OrderEntity, ['dishes']) {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
