import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrderEntity } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';
import { Payment } from './payments/entities/payment.entity';
import { PaymentsModule } from './payments/payments.module';
import { CategoryEntity } from './restaurants/entities/category.entity';
import { DishEntity } from './restaurants/entities/dish.entity';
import { RestaurantEntity } from './restaurants/entities/restaurant.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UserEntity } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      //サーバーにdeployする時envファイルを使わない。
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test'),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN: Joi.string().required(),
        MAILGUN_EMAIL: Joi.string().required(),
        AWS_S3_SECRET_KEY: Joi.string().required(),
        AWS_S3_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      //serverにdeployされた時はplaygroundを使わない
      playground: process.env.NODE_ENV !== 'production',
      //サーバにwebsocket機能を持たせる。
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      // websocketとhttp-requestは動く方法が違う
      // websocketは連結されたらずっと連結されている。
      // websocketにはrequestがない-> connectionがある。
      // http requestは連結毎にtokenを送るが connectionは最初に一回だけ送ってずっと繋がっている。
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        if (req) {
          return { token: req.headers[TOKEN_KEY] };
        } else if (connection) {
          return { token: connection.context['x-jwt'] };
        }
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      entities: [
        UserEntity,
        Verification,
        RestaurantEntity,
        CategoryEntity,
        DishEntity,
        OrderEntity,
        OrderItem,
        Payment,
      ],
      synchronize: true,
      logging:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      fromEmail: process.env.MAILGUN_EMAIL,
    }),
    PaymentsModule,
    UploadsModule.forRoot({
      secretKey: process.env.AWS_S3_SECRET_KEY,
      privateKey: process.env.AWS_S3_KEY,
    }),
  ],
  controllers: [],
})
export class AppModule {}
