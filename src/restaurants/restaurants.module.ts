import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, CategoryRepository])],
  //providersに追加しないとgraphqlで見えない。
  providers: [RestaurantsResolver, RestaurantsService, CategoryResolver],
})
export class RestaurantsModule {}
