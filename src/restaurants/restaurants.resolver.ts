import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantEntity } from './entities/restaurant.entity';

@Resolver()
export class RestaurantsResolver {
  @Query((type) => [RestaurantEntity])
  restaurants(@Args('veganOnly') veganOnly: boolean): RestaurantEntity[] {
    return [];
  }

  @Mutation((type) => Boolean)
  createRestaurants(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    return true;
  }
}
