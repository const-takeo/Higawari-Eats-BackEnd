import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderEntity } from '../entities/order.entity';

@InputType()
export class TakeOrderInput extends PickType(OrderEntity, ['id']) {}

@ObjectType()
export class TakeOrderOutput extends CoreOutput {}
