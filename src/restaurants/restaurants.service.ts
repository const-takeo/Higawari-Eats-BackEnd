import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { RestaurantEntity } from './entities/restaurant.entity';

@Injectable() // ??
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurants: Repository<RestaurantEntity>,
  ) {}
  getAll(): Promise<RestaurantEntity[]> {
    return this.restaurants.find();
  }

  async createRestaurants(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      const instance = this.restaurants.create(createRestaurantDto);
      await this.restaurants.save(instance);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateRestaurant(
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurants.update(updateRestaurantDto.id, {
        ...updateRestaurantDto.data,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
