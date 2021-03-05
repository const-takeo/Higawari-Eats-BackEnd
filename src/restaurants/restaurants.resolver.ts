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
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import {
  MyRestaurantInput,
  MyRestaurantOutput,
} from './dtos/my-restaurant.dto';
import { MyRestaurnatsOutput } from './dtos/my-restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurnatOutput,
} from './dtos/search-restaurant.dto';
import { CategoryEntity } from './entities/category.entity';
import { DishOptions } from './entities/dish.entity';
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
  //restaurants
  @Query((type) => RestaurantsOutput)
  restaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantsService.allRestaurants(restaurantsInput);
  }
  //restaurant
  @Query((type) => RestaurantOutput)
  restaurant(
    @Args('input') retaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantsService.findRestaurantById(retaurantInput);
  }
  //searchRestaurant by string
  @Query((type) => SearchRestaurnatOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurnatOutput> {
    return this.restaurantsService.searchRestaurant(searchRestaurantInput);
  }

  //myRestaurants
  @Query((returns) => MyRestaurnatsOutput)
  @Role(['Owner'])
  myRestaurants(@AuthUser() owner: UserEntity): Promise<MyRestaurnatsOutput> {
    return this.restaurantsService.myRestaurants(owner);
  }
  //myRestaurant
  @Query((returns) => MyRestaurantOutput)
  @Role(['Owner'])
  myRestaurant(
    @AuthUser() owner: UserEntity,
    @Args('input') myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    return this.restaurantsService.myRestaurant(owner, myRestaurantInput);
  }
  //
}
//categories
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
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
  //
}
//Dishes
@Resolver((type) => DishOptions)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}
  @Mutation((type) => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @AuthUser() owner: UserEntity,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput);
  }

  @Mutation((type) => EditDishOutput)
  @Role(['Owner'])
  editDish(
    @AuthUser() owner: UserEntity,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDish(owner, editDishInput);
  }

  @Mutation((type) => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @AuthUser() owner: UserEntity,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput);
  }
}
