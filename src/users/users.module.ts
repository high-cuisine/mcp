import { Module } from "@nestjs/common";
import { UserRepository } from "./repositorys/user.repository";
import { MongooseModule as Mongoose } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/User.shema";

@Module({
    imports: [Mongoose.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [UserRepository],
    exports: [UserRepository]
})
export class UsersModule {}