import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { DishEntity } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType() // schema, Graphql typeDef
@Entity() // TypeORM for DB
export class RestaurantEntity extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  // Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods.
  @Field((type) => CategoryEntity, { nullable: true })
  @ManyToOne((type) => CategoryEntity, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  category: CategoryEntity;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (owner) => owner.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity;

  @Field((type) => [OrderEntity])
  @OneToMany((type) => OrderEntity, (orders) => orders.restaurant)
  orders: OrderEntity[];
  //relationをロードしずにidを確認する事ができる。
  @RelationId((restaurant: RestaurantEntity) => restaurant.owner)
  ownerId: number;

  @Field((type) => [DishEntity])
  @OneToMany((type) => DishEntity, (dish) => dish.restaurant)
  menu: DishEntity[];

  @Field((type) => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil: Date;
}
