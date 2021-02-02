import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CategoryEntity } from '../entities/category.entity';

@ArgsType()
export class CategoryInput {
  @Field((type) => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends CoreOutput {
  @Field((type) => CategoryEntity, { nullable: true })
  category?: CategoryEntity;
}
