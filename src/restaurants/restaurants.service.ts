import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { RestaurantEntity } from './entities/restaurant.entity';

@Injectable() // ??
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurants: Repository<RestaurantEntity>,
  ) {}

  async createRestaurants(
    owner: UserEntity,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const instance = this.restaurants.create(createRestaurantInput);
      await this.restaurants.save(instance);
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
}
