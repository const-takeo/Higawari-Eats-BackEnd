import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@InputType('DishOptionsInputType', { isAbstract: true })
@ObjectType()
export class DishOptions {
  @Field((type) => String)
  name: string;
  @Field((type) => [String], { nullable: true })
  choices?: string[];
  @Field((type) => Int, { nullable: true })
  extra?: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class DishEntity extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo?: string;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5, 140)
  description: string;

  @Field((type) => RestaurantEntity)
  //ManyToOne relationでnullableを基本falseにしないとエラーなしで動きちゃう、それはダメ
  //関連付けられてないのに動くのはダメ、だからdefaultとして nullable:falseにする。
  @ManyToOne((type) => RestaurantEntity, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  restaurant: RestaurantEntity;

  @RelationId((dish: DishEntity) => dish.restaurant)
  restaurantId: number;
  //json data tpyeはmysql, postgresで支援している。
  //構造化されたデータを保存する時や特定の形を持つデータを保存する時json typeを使用する。
  @Field((type) => [DishOptions], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOptions[];
}
