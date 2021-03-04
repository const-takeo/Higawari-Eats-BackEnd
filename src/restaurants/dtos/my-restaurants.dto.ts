import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@ObjectType()
export class MyRestaurnatsOutput extends CoreOutput {
  @Field(() => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
}
