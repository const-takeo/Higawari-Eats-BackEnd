import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  COOKED = 'COOCKED',
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
    eager: true,
  })
  customer?: UserEntity;
  //restaurant
  @Field((type) => RestaurantEntity, { nullable: true })
  @ManyToOne((type) => RestaurantEntity, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  restaurant?: RestaurantEntity;
  //customerId
  @RelationId((order: OrderEntity) => order.customer)
  customerId: number;
  //driverId
  @RelationId((driver: OrderEntity) => driver.driver)
  driverId: number;
  //driver
  @Field((type) => UserEntity, { nullable: true })
  @ManyToOne((type) => UserEntity, (drive) => drive.rides, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  driver: UserEntity;
  //dish
  //ManyToManyを使う場合は@JoinTableを使用 -> 所有している側に追加する。
  @Field((type) => [OrderItem])
  @ManyToMany((type) => OrderItem, { eager: true })
  @JoinTable()
  items: OrderItem[];
  //total
  @Column({ nullable: true })
  @Field((type) => Float, { nullable: true })
  @IsNumber()
  total?: number;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  @Field((type) => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
