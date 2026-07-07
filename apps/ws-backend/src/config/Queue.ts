
import { Queue } from "bullmq";


export const BullMQConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
} as const;


export const mainQueue = new Queue('main-queue', {connection:BullMQConnection})