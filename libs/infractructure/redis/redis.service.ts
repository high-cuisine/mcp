import { Inject, Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string, options: { EX: number }) {
        return await this.redisClient.set(key, value, 'EX', options.EX);
    }
}