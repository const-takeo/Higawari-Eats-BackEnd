import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { DishEntity } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(DishEntity, [
  'name',
  'price',
  'options',
  'description',
]) {
  @Field((type) => Int)
  restaunrantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}
