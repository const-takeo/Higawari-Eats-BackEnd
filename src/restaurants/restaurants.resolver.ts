import { Query, Resolver } from '@nestjs/graphql';
import { RestaurantEntity } from './entities/restaurant.entity';

@Resolver()
export class RestaurantsResolver {
  @Query((type) => RestaurantEntity)
  myRestaurant(): RestaurantEntity {
    return { name: 'Kakao', isGood: null };
  }

  @Query((type) => Boolean)
  isGood(): boolean {
    return true;
  }
}
