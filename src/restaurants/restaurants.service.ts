import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
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
import { DishEntity } from './entities/dish.entity';
import { RestaurantEntity } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable() // ??
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurants: Repository<RestaurantEntity>,
    @InjectRepository(DishEntity)
    private readonly dishes: Repository<DishEntity>,
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
        restaurantId: newRestaurant.id,
      };
    } catch (error) {
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
  //delete
  async deleteRestaurant(
    owner: UserEntity,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'レストランが見つかりません',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: '所有してないレストランは削除できません',
        };
      }
      await this.restaurants.delete(restaurantId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '削除できません',
      };
    }
  }
  //
  //Categories
  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'カテゴリーを読み取ることができませんでした',
      };
    }
  }
  //countRestaurant
  async countRestaurant(category: CategoryEntity): Promise<number> {
    return await this.restaurants.count({ category });
  }
  //findCategoryBySlug
  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      //dbで必要なもの(関連付けられているentitiy)をロードするときは必ず明示する事。relation
      //{ relations: ['restaurants'] }, 関連付けてロードする事はできるが数が多い場合DBにものすごい負担が掛かる
      // => paginationを作る
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'カテゴリーを見つかる事ができませんでした',
        };
      }
      //pagination
      const restaurants = await this.restaurants.find({
        where: {
          category,
        },
        //descending true => up ↑ false => down ⇩
        order: {
          isPromoted: 'DESC',
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      category.restaurants = restaurants;
      const totalResults = await this.countRestaurant(category);
      return {
        ok: true,
        category,
        restaurants,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'カテゴリーを読み取ることができませんでした',
      };
    }
  }
  //allRestaurants
  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        skip: (page - 1) * 6,
        take: 6,
        //descending true => up ↑ false => down ⇩
        order: {
          isPromoted: 'DESC',
        },
      });
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 6),
        totalResults,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'レソトランを読み取る事に失敗しました。',
      };
    }
  }
  //findRestaurantById
  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      //idでレストランを読み取る時メニューも一緒に読み取らなければならない。
      const restaurant = await this.restaurants.findOne(restaurantId, {
        relations: ['menu'],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'レストランを見つかる事ができませんでした。',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'レストランを見つかる事ができませんでした。',
      };
    }
  }
  //
  async searchRestaurant({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurnatOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {
          // name: Like(`%${query}%`),
          name: Raw((name) => `${name} ILIKE '%${query}%'`),
        },
        //make function for pagination after complete this project
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(totalResults / 25),
        totalResults,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'レストランを見つかる事ができませんでした。',
      };
    }
  }
  //createDish
  async createDish(
    owner: UserEntity,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    const restaurant = await this.restaurants.findOne(
      createDishInput.restaunrantId,
    );
    try {
      //defensive programming!!!!!!
      if (!restaurant) {
        return {
          ok: false,
          error: 'レストランを見つかる事ができませんでした。',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: '変更出来ません。',
        };
      }
      await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'メニューをつくろ事が出来ません',
      };
    }
  }
  //editDish
  async editDish(
    owner: UserEntity,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    try {
      //dishはレストランを持っているがrelationsをロードしてくれなきゃダメです。
      const dish = await this.dishes.findOne(editDishInput.dishId, {
        relations: ['restaurant'],
      });
      //dont forget defensive programming!!
      if (!dish) {
        return {
          ok: false,
          error: 'メニューを探す事が出来ませんでした',
        };
      }
      //ownerが一緒なのか確認
      //restaurantのownerIdを持ってくるのでrelationが必要
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: '所有してないレストランのメニューを削除する事は出来ません',
        };
      }
      //save functionはidを渡すとentityをupdateしてくれる。
      await this.dishes.save([{ id: editDishInput.dishId, ...editDishInput }]);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'メニューを削除する事が出来ませんでした。',
      };
    }
  }

  //deleteDish
  async deleteDish(
    owner: UserEntity,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      //dishはレストランを持っているがrelationsをロードしてくれなきゃダメです。
      const dish = await this.dishes.findOne(dishId, {
        relations: ['restaurant'],
      });
      //dont forget defensive programming!!
      if (!dish) {
        return {
          ok: false,
          error: 'メニューを探す事が出来ませんでした',
        };
      }
      //ownerが一緒なのか確認
      //restaurantのownerIdを持ってくるのでrelationが必要
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: '所有してないレストランのメニューを削除する事は出来ません',
        };
      }
      await this.dishes.delete(dishId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'メニューを削除する事が出来ませんでした。',
      };
    }
  }
  //

  async myRestaurants(owner: UserEntity): Promise<MyRestaurnatsOutput> {
    try {
      const restaurants = await this.restaurants.find({ owner });
      if (!restaurants) {
        return {
          ok: false,
          error: '見つかる事ができませんでした',
        };
      }
      return {
        ok: true,
        restaurants,
      };
    } catch (error) {
      return {
        ok: false,
        error: '見つかる事ができませんでした',
      };
    }
  }

  //

  async myRestaurant(
    owner: UserEntity,
    { id }: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        { owner, id },
        { relations: ['menu', 'orders'] },
      );
      if (!restaurant) {
        return {
          ok: false,
          error: '見つかる事ができませんでした',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      return {
        ok: false,
        error: '見つかる事ができませんでした',
      };
    }
  }

  //
}
