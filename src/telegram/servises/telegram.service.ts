import { Injectable } from "@nestjs/common";
import { InjectBot, On, TelegrafModule } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { Context } from "telegraf";
import { UserRepository } from "../../users/repositorys/user.repository";
import { RedisService } from "@infra/redis/redis.service";
import { ProccesorService } from "../../proccesor/services/proccesor.service";



@Injectable()
export class TelegramService {
    constructor(
        @InjectBot() private readonly bot: Telegraf,
        private readonly userRepository: UserRepository,
        private readonly redisService: RedisService,
        private readonly proccesorService: ProccesorService
    ) {
        
    }

    async sendMessage(ctx: Context) {
        try {
            const user = await this.getUser(ctx);

            if(!user) {
                const newUser = await this.createUser(ctx);
                await ctx.reply(`Добро пожаловать в бота!`);
                return;
            }

            const messages = [...user.messages.map(m => ({ role: m.role, content: m.text })), { role: 'user', content: (ctx.message as any)?.text }];

            const res = await this.proccesorService.sendMessage(messages);

            console.log(res);

            if(!res) {
                await ctx.reply('Ошибка при отправке сообщения');
                return;
            }

            this.userRepository.addMessage(user._id, [
                { text: (ctx.message as any)?.text, role: 'user' },
                { text: res, role: 'assistant' }
            ]);
            await ctx.reply(res);
            return;

            // написал- потправили в процессор - получили ответ - отправили - зарегали ответ
        } catch (error) {
            console.error('Error in sendMessage:', error);
            await ctx.reply('Произошла ошибка при обработке сообщения');
        }
    }

    private async getUser(ctx: Context) {
        const telegramId = ctx.from?.id?.toString();

        const userCache = await this.redisService.get(`user:${telegramId}`);
        if (userCache) {
            return JSON.parse(userCache);
        }
        const user = await this.userRepository.findByTelegramId(telegramId!);
        if (user) {
            await this.redisService.set(`user:${telegramId}`, JSON.stringify(user), { EX: 60 * 60 * 24 * 30 });
            return user;
        }
        
        return null;
    }
    
    private async createUser(ctx: Context) {
        const userCreateData = {
            telegramId: ctx.from?.id?.toString(),
            telegramName: ctx.from?.username,
            telegramNumber: ctx.from?.id,
            whatsappNumber: ctx.from?.id,
            createdAt: new Date(),
            messages: []
        }

        if(!userCreateData.telegramId || !userCreateData.telegramName || !userCreateData.telegramNumber || !userCreateData.whatsappNumber) {
            return null;
        }
        const newUser = await this.userRepository.createUser(
            userCreateData.telegramId,
            userCreateData.telegramName,
            userCreateData.telegramNumber.toString(),
            userCreateData.whatsappNumber.toString(),
            userCreateData.createdAt
        );
        return newUser;
    }
    
}