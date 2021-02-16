import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderEntity } from '../entities/order.entity';

@InputType()
export class EditOrderInput extends PickType(OrderEntity, ['id', 'status']) {}

@ObjectType()
export class EditOrderOutput extends CoreOutput {}
