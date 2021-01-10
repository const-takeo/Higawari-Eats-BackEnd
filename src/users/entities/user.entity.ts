import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

type UserRole = 'client' | 'owner' | 'delivery';

@ObjectType()
@Entity()
export class UserEntity extends CoreEntity {
  @Field((type) => String)
  @Column()
  email: string;

  @Field((type) => String)
  @Column()
  password: string;

  @Field((type) => String)
  @Column()
  role: UserRole;
}
