import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType() // schema, Graphql typeDef
export class RestaurantEntity {
  @Field((type) => String)
  name: string;

  @Field((type) => Boolean, { nullable: true })
  isGood: boolean;
}
