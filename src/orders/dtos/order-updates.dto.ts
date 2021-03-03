import { InputType, PickType } from '@nestjs/graphql';
import { OrderEntity } from '../entities/order.entity';

@InputType()
export class OrderUpdateInput extends PickType(OrderEntity, ['id']) {}
