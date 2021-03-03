import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field(() => String)
  @Column()
  transactionId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.payments)
  user: UserEntity;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @Field(() => RestaurantEntity)
  @ManyToOne(() => RestaurantEntity)
  restaurant: RestaurantEntity;

  @Field((type) => Int)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
