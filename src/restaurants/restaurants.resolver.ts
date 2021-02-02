import { SetMetadata } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { CategoryEntity } from './entities/category.entity';
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
    @AuthUser() owner: UserEntity,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantsService.editRestaurant(owner, editRestaurantInput);
  }
  //delete
  @Mutation((type) => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
    @AuthUser() owner: UserEntity,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantsService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }
  //
}
//
@Resolver((of) => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}
  //
  //Computed Field, Dynamic Field => DB(entity)に保存されない、resolverで計算して返すField
  @ResolveField((type) => Int)
  restaurantCount(@Parent() category: CategoryEntity): Promise<number> {
    console.log(category);
    return this.restaurantService.countRestaurant(category);
  }
  //allCategories
  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }
  //
  @Query((type) => CategoryOutput)
  category(@Args() categoryInput: CategoryInput): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
  //
}
