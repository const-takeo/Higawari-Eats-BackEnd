import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './entities/dish.entity';
import { RestaurantEntity } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import {
  CategoryResolver,
  DishResolver,
  RestaurantsResolver,
} from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantEntity,
      CategoryRepository,
      DishEntity,
    ]),
  ],
  //providersに追加しないとgraphqlで見えない。
  providers: [
    RestaurantsResolver,
    RestaurantsService,
    CategoryResolver,
    DishResolver,
  ],
})
export class RestaurantsModule {}
