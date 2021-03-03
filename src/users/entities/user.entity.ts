import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class UserEntity extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  // optionのselectを使いpasswordが呼び出されるのを防止
  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field((type) => [RestaurantEntity])
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.owner)
  restaurants: RestaurantEntity[];
  //customer
  @Field((type) => [OrderEntity])
  @OneToMany((type) => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];
  //driver
  @Field((type) => [OrderEntity])
  @OneToMany((type) => OrderEntity, (order) => order.driver)
  rides: OrderEntity[];
  //payments
  @Field((type) => [Payment])
  @OneToMany((type) => Payment, (payment) => payment.user)
  payments: Payment[];

  //entityのクラスの中に作成する。非同期関数として作成
  // @BeforeInsert() <- Listenerを使用する。
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassowrd(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  // check the password
  async checkPassword(
    aPassword: string,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const result = await bcrypt.compare(aPassword, this.password);
      if (!result) {
        return {
          ok: false,
          error: 'Wrong Password',
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
