import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderEntity } from '../entities/order.entity';

@InputType()
export class GetOrderInput extends PickType(OrderEntity, ['id']) {}

@ObjectType()
export class GetOrderOutput extends CoreOutput {
  @Field((type) => OrderEntity, { nullable: true })
  order?: OrderEntity;
}
