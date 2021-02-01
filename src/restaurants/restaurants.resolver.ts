import { SetMetadata } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Resolver()
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  //createRestaurants
  @Mutation((type) => CreateRestaurantOutput)
  @Role(['Owner'])
  @SetMetadata('role', UserRole.Owner)
  async createRestaurants(
    @AuthUser() authUser: UserEntity,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurants(
      authUser,
      createRestaurantInput,
    );
  }
  //editRestaurant
  @Mutation((type) => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() authUser: UserEntity,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): EditRestaurantOutput {
    return { ok: true };
  }
}
