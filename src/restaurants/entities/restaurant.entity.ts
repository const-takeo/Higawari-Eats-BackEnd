import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CategoryEntity } from './category.entity';

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

  @Field((type) => CategoryEntity, { nullable: true })
  @ManyToOne((type) => CategoryEntity, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (owner) => owner.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity;

  @RelationId((restaurant: RestaurantEntity) => restaurant.owner)
  ownerId: number;
}
