import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
