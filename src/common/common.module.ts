import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common.constants';

//graphql-subscription
//pubsubはアプリケーションの中で一つしか作れない。
const pubsub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubsub,
    },
  ],
  //globalだとしてもexportsしないと使えない。
  exports: [PUB_SUB],
})
export class CommonModule {}
