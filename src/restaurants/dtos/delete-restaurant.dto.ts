import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { EditRestaurantInput } from './edit-restaurant.dto';

@InputType()
export class DeleteRestaurantInput extends PickType(EditRestaurantInput, [
  'restaurantId',
]) {}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}
