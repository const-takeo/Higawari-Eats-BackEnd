import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType() // schema, Graphql typeDef
@Entity() // TypeORM for DB
export class CategoryEntity extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((type) => [RestaurantEntity])
  @OneToMany((type) => RestaurantEntity, (restaurant) => restaurant.category)
  restaurants: RestaurantEntity[];
}
