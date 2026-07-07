import { Job, Worker } from "bullmq";
import { BullMQConnection } from "../config/Queue";
import { prisma } from "@repo/db";

const worker = new Worker(
  "chat-operations",
  async (job: Job) => {
    switch (job.name) {
      case "save-chat":
        await prisma.chat.create({
          data: {
            ...job.data,
          },
        });
        break;
      default:
        break;
    }
  },
  { connection: BullMQConnection, concurrency: 10 },
);

worker.on("failed", (job, err) => {
  console.error(`Shape ${job?.data?.id} failed after retries:`, err.message);
});
