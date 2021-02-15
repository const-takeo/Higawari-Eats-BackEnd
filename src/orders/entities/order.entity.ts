import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';
import { DishEntity } from 'src/restaurants/entities/dish.entity';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export enum OrderStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  PICKEDUP = 'PICKEDUP',
  DELIVERED = 'DELIVERED',
}
//for graphql
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderEntity extends CoreEntity {
  //userを削除してもorderは残す、なのでnull設定
  @Field((type) => UserEntity, { nullable: true })
  @ManyToOne((type) => UserEntity, (customer) => customer.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  customer?: UserEntity;
  //restaurant
  @Field((type) => RestaurantEntity)
  @ManyToOne((type) => RestaurantEntity, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  restaurant: RestaurantEntity;
  //driver
  @Field((type) => UserEntity, { nullable: true })
  @ManyToOne((type) => UserEntity, (drive) => drive.rides, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  driver: UserEntity;
  //dish
  //ManyToManyを使う場合は@JoinTableを使用 -> 所有している側に追加する。
  @Field((type) => [DishEntity])
  @ManyToMany((type) => DishEntity)
  @JoinTable()
  dishes: DishEntity[];
  //total
  @Column()
  @Field((type) => Float)
  total: number;
  @Column({ type: 'enum', enum: OrderStatus })
  @Field((type) => OrderStatus)
  status: OrderStatus;
}
