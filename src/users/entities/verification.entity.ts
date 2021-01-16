import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  //   OneToOne Relationship
  //JoinColumnを設定された側がrelation idを持つ。
  @OneToOne((type) => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
