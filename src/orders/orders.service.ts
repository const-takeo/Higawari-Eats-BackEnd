import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATES,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import { DishEntity } from 'src/restaurants/entities/dish.entity';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/eidt-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderEntity, OrderStatus } from './entities/order.entity';

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
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}
  async createOrder(
    customer: UserEntity,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'レストランを見つかる事ができませんでした。',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
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
        //base price
        let dishFinalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishes) => dishes.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices?.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice += dishFinalPrice;
        const orderItem = await this.orderItems.save(
          this.orderItems.create({ dish, options: item.options }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      //pulbishのpayloadを変更した場合resolver側も変更しなければならない。
      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { order, ownerId: restaurant.ownerId },
      });
      return {
        ok: true,
        orderId: order.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: '注文に失敗しました',
      };
    }
  }
  //getOrders
  async getOrders(
    user: UserEntity,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: OrderEntity[];
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurants.find({
          where: {
            owner: user,
          },
          relations: ['orders'],
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
      }
      return {
        ok: true,
        orders,
      };
    } catch (error) {
      return {
        ok: false,
        error: '注文リストを読み取る事に失敗しました',
      };
    }
  }
  allowedSee(user: UserEntity, order: OrderEntity): boolean {
    let allowed = true;
    if (user.role === UserRole.Client && user.id !== order.customerId) {
      allowed = false;
    }
    if (user.role === UserRole.Delivery && user.id !== order.driverId) {
      allowed = false;
    }
    if (user.role === UserRole.Owner && user.id !== order.restaurant.ownerId) {
      allowed = false;
    }
    return allowed;
  }

  //getOrder
  async getOrder(
    user: UserEntity,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: '注文を見つかる事ができませんでした',
        };
      }
      if (!this.allowedSee(user, order)) {
        return {
          ok: false,
          error: '権限がありません',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error: '注文を読み取る事に失敗しました',
      };
    }
  }
  //editOrder
  async editOrder(
    user: UserEntity,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        //use eager relationship
        //restaurantをロードする度にrelationされているrelationshipを自動的にロードしてくれる。
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: '注文を見つかる事ができませんでした',
        };
      }
      if (!this.allowedSee(user, order)) {
        return {
          ok: false,
          error: '権限がありません',
        };
      }
      let allowedEdit = true;
      if (user.role === UserRole.Client) {
        allowedEdit = false;
      }
      if (user.role === UserRole.Owner) {
        if (status !== OrderStatus.COOKED && status !== OrderStatus.COOKING) {
          allowedEdit = false;
        }
      }
      if (user.role === UserRole.Delivery) {
        if (
          status !== OrderStatus.PICKEDUP &&
          status !== OrderStatus.DELIVERED
        ) {
          allowedEdit = false;
        }
      }
      if (!allowedEdit) {
        return {
          ok: false,
          error: '権限がありません',
        };
      }
      //saveはupdate時全体のデータを送らない。
      await this.orders.save({ id: orderId, status });
      const newOrder = { ...order, status };
      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.COOKED) {
          await this.pubSub.publish(NEW_COOKED_ORDER, {
            cookedOrders: newOrder,
          });
        }
      }
      await this.pubSub.publish(NEW_ORDER_UPDATES, { orderUpdates: newOrder });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '権限がありません',
      };
    }
  }
  //
  async takeOrder(
    driver: UserEntity,
    { id: orderId }: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId);
      if (!order) {
        return {
          ok: false,
          error: '注文を見つかる事ができませんでした。',
        };
      }
      if (order.driver) {
        return {
          ok: false,
          error: 'ドライバーが既に存在します。',
        };
      }
      //存在すればorderidとdriverをupdateする。
      await this.orders.save({ id: orderId, driver });
      await this.pubSub.publish(NEW_ORDER_UPDATES, {
        orderUpdates: { ...order, driver },
      });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '権限がありません',
      };
    }
  }
  //
}
