import { Model } from "mongoose";
import { UserSchema } from "../schemas/User.shema"; 
import { InjectModel } from "@nestjs/mongoose";

export class UserRepository {
    constructor(
        @InjectModel('User') private readonly userModel: Model<typeof UserSchema>
    ) {}
    async createUser(telegramId: string, telegramName: string, telegramNumber: string, whatsappNumber: string, createdAt: Date) {

     
        

        try {
            const newUser = await this.userModel.create({
                telegram_id: telegramId,
                telegram_name: telegramName,
                telegram_number: telegramNumber,
                whatsapp_number: whatsappNumber,
                created_at: createdAt,
                messages: []
            });
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUserById(id: string) {
        const user = await this.userModel.findById(id);
        return user;
    }

    async getUserByTelegramId(telegramId: string) {
        const user = await this.userModel.findOne({ telegram_id: telegramId });
        return user;
    }

    async addMessage(userId: string, message: { text: string, role: string }[]) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userModel.findByIdAndUpdate(
            userId,
            { $push: { messages: { $each: message.map(m => ({ text: m.text, role: m.role, created_at: new Date() })) } } },
            { new: true }
        );
        const updatedUser = await this.userModel.findById(userId);
        return updatedUser;
    }

    async findByTelegramId(telegramId: string) {
        try {
            const user = await this.userModel.findOne({ telegram_id: telegramId });
            return user;
        } catch (error) {
            console.error('Error finding user by telegram ID:', error);
            return null;
        }
    }
}