import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './servises/telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './telegram.update';
import { cfg } from '@common/config/config.service';
import { RedisModule } from '@infra/redis/redis.module';
import { ProccesorModule } from '../proccesor/proccesor.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: cfg.telegram.token,
      }),
    }),
    RedisModule,
    ProccesorModule,
    UsersModule,
  ],
  providers: [BotUpdate, TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {}
