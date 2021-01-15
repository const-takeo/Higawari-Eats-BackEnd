import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn()
  @IsDate()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  @Field((type) => Date)
  updatedAt: Date;
}
