import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // schema, Graphql typeDef
@Entity() // TypeORM for DB
export class RestaurantEntity {
  @Field((type) => Number)
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => Boolean, { defaultValue: false })
  @Column()
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  categoryName: string;
}
