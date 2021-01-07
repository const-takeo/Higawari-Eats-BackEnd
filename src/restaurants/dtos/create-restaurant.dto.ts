import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  location: string;

  @Field((type) => String)
  address: string;

  @Field((type) => String)
  ownerName: string;

  @Field((type) => Boolean)
  isVegan: boolean;
}
