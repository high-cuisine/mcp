import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProccesorModule } from './proccesor/proccesor.module';
import { TelegramModule } from './telegram/telegram.module';
import { MongooseModule } from '@infra/mongoose/mongoose.module';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [ScheduleModule.forRoot(), ProccesorModule, MongooseModule, CrmModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
