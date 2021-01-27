import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@ObjectType() // schema, Graphql typeDef
@Entity() // TypeORM for DB
export class CategoryEntity extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => [RestaurantEntity])
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.category)
  restaurants: RestaurantEntity[];
}
