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

@Injectable() // ??
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurants: Repository<RestaurantEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categories: Repository<CategoryEntity>,
  ) {}
  //
  async getOrCreateCategory(name: string): Promise<CategoryEntity> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    const category = await this.categories.findOne({ slug: categorySlug });
    if (!category) {
      await this.categories.save(
        this.categories.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }

  //createRestaurants
  async createRestaurants(
    owner: UserEntity,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.getOrCreateCategory(
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
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'レストランの編集が出来ません',
      };
    }
  }
}
