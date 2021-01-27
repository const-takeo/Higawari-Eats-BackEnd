import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';

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

  @Field((type) => CategoryEntity)
  @ManyToOne((type) => CategoryEntity, (category) => category.restaurants)
  category: CategoryEntity;
}
