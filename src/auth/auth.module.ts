import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UsersModule],
  providers: [
    {
      //guardをappのとこでも使いたいならAPP_GUARDをprovideする。
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
