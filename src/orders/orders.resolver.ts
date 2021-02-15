import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './orders.service';

@Resolver((type) => OrderEntity)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}

  @Mutation((type) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: UserEntity,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return { ok: false };
  }
}
