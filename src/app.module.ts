import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RestaurantsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'takeo',
      password: '0000',
      database: 'Higawari-Eats',
      entities: [],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
