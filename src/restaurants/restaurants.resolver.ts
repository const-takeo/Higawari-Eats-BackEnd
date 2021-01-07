import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RestaurantsResolver {
  @Query((type) => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
}
