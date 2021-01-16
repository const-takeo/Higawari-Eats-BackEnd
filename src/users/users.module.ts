import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Verification])], //Repositryの使用 Connectionのoptionを提供。
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
