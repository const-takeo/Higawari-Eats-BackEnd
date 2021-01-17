import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  //   OneToOne Relationship
  //JoinColumnを設定された側がrelation idを持つ。
  @OneToOne((type) => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  // Listenerを利用してcodeを作成
  @BeforeInsert()
  createCode() {
    this.code = uuidv4().replace(/-/g, '');
  }
}
