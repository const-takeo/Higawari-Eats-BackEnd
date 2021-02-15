import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from 'src/restaurants/entities/dish.entity';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orders: Repository<OrderEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurants: Repository<RestaurantEntity>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(DishEntity)
    private readonly dishes: Repository<DishEntity>,
  ) {}
  async createOrder(
    customer: UserEntity,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = this.restaurants.findOne(restaurantId);
    if (!restaurant) {
      return {
        ok: false,
        error: 'レストランを見つかる事ができませんでした。',
      };
    }
    //forEachの中ではreturn出来ない、→　error処理がちゃんと出来ない　→　createOrderは止まらない
    //instead use for...of
    for (const item of items) {
      const dish = await this.dishes.findOne(item.dishId);
      if (!dish) {
        return {
          ok: false,
          error: 'メニューが存在しません',
        };
      }
      console.log(dish.price);
      for (const itemOption of item.options) {
        const dishOption = dish.options.find(
          (dishOption) => dishOption.name === itemOption.name,
        );
        if (dishOption) {
          if (dishOption.extra) {
            console.log(dishOption.extra);
          } else {
            const dishOptionChoice = dishOption.choices.find(
              (optionChoice) => optionChoice.name === itemOption.choice,
            );
            if (dishOptionChoice.extra) {
              console.log(dishOptionChoice.extra);
            }
          }
        }
      }
      //   await this.orderItems.save(
      //     this.orderItems.create({ dish, options: item.options }),
      //   );
      // }
      // const order = await this.orders.save(this.orders.create({ customer }));
    }
  }
}
