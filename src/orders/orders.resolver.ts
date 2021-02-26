import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/eidt-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersOutput, GetOrdersInput } from './dtos/get-orders.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './orders.service';

//graphql-subscription
const pubsub = new PubSub();

@Resolver((type) => OrderEntity)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}
  //createOrder
  @Mutation((type) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: UserEntity,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }
  //editOrder
  @Mutation((type) => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: UserEntity,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }
  //getOrders
  @Query((type) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: UserEntity,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }
  //getOrder
  @Query((type) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: UserEntity,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((type) => Boolean)
  potatoReady() {
    pubsub.publish('trigger', { orderSubscription: 'Kakao talk~!' });
    return true;
  }
  //graphql subscription
  //subscriptionはresolverでの変更された事やアップデートをlistenする。
  //subscriptionはwebsocketを活性化させる必要がある。 => appModule => graphqlModule
  //mutation.. Queryはhttpで動く
  //subscriptionは　websocket上で動く。
  @Subscription((type) => String)
  @Role(['Any'])
  orderSubscription(@AuthUser() user: UserEntity) {
    //pubsub => publish, subscribe
    //triggerは俺が待っているanyイベント,名前はなんでもいい
    console.log(user);
    return pubsub.asyncIterator('trigger');
  }
}
