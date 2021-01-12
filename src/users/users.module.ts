import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigService], //Repositryの使用
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
