import { Args, Query, Resolver } from '@nestjs/graphql';
import { RestaurantEntity } from './entities/restaurant.entity';

@Resolver()
export class RestaurantsResolver {
  @Query((type) => [RestaurantEntity])
  restaurants(@Args('veganOnly') veganOnly: boolean): RestaurantEntity[] {
    return [];
  }
}
