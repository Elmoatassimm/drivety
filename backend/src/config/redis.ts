import { createClient } from "redis";
import { injectable, singleton } from "tsyringe";

@injectable()
@singleton()
export class RedisClient {
  private client;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });
    
    this.connect();
    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Redis client connected");
    } catch (error) {
      console.error("Redis connection error:", error);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
}
