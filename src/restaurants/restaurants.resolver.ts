import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { RestaurantEntity } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';

@Resolver()
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @Query((type) => [RestaurantEntity])
  getAll(): Promise<RestaurantEntity[]> {
    return this.restaurantsService.getAll();
  }

  @Query((type) => [RestaurantEntity])
  restaurants(@Args('veganOnly') veganOnly: boolean): RestaurantEntity[] {
    return [];
  }

  @Mutation((type) => Boolean)
  createRestaurants(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    return this.restaurantsService.createRestaurants(createRestaurantDto);
  }

  @Mutation((type) => Boolean)
  updateRestaurant(
    @Args() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    return this.restaurantsService.updateRestaurant(updateRestaurantDto);
  }
}
