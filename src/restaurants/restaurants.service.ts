import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { CategoryEntity } from './entities/category.entity';
import { RestaurantEntity } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable() // ??
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurants: Repository<RestaurantEntity>,
    private readonly categories: CategoryRepository,
  ) {}

  //createRestaurants
  async createRestaurants(
    owner: UserEntity,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        error: 'レストランを作れません。',
        ok: false,
      };
    }
  }
  //editRestaurant
  async editRestaurant(
    owner: UserEntity,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      //defensive programming
      const restaurant = await this.restaurants.findOne(
        editRestaurantInput.restaurantId,
        {
          //全体のobjectを読み取るのではなくidだけを持ってくる、dbのスピードに役に立つ
          loadRelationIds: true,
        },
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'レストランが見つかりません',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: '所有してないレストランは編集できません',
        };
      }
      let category: CategoryEntity = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      //saveにidを渡さないとupdateできない。
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'レストランの編集が出来ません',
      };
    }
  }
}
