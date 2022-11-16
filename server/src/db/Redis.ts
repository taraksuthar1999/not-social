import Redis  from "ioredis"

export default class RedisProvider{
    public static client:Redis

    static async init(){
            this.client = new Redis(Number(process.env.REDIS_PORT),process.env.REDIS_HOST)
    }
}