import { Ctx, On, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { TelegramService } from "./servises/telegram.service";


@Update()
export class BotUpdate {
    constructor(private readonly telegramService: TelegramService) {}
    @On('message')
    async onMessage(@Ctx() ctx: Context) {
        await this.telegramService.sendMessage(ctx);
    }
}