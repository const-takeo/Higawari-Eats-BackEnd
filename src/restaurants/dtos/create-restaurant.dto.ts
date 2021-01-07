import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @IsString()
  @Length(2, 5)
  @Field((type) => String)
  name: string;

  @IsString()
  @Field((type) => String)
  location: string;

  @IsString()
  @Field((type) => String)
  address: string;

  @IsString()
  @Field((type) => String)
  ownerName: string;

  @IsBoolean()
  @Field((type) => Boolean)
  isVegan: boolean;
}
