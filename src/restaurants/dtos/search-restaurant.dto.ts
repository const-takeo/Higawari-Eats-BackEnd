import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchRestaurnatOutput extends PaginationOutput {
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
}
