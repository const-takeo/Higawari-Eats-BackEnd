import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

//custom-repository #typeOrm
@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  async getOrCreate(name: string): Promise<CategoryEntity> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    const category = await this.findOne({ slug: categorySlug });
    if (!category) {
      await this.save(this.create({ slug: categorySlug, name: categoryName }));
    }
    return category;
  }
}
