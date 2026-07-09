import { prisma } from "@repo/db";
import { Job, Worker } from "bullmq";
import { BullMQConnection } from "../config/Queue";

const worker = new Worker(
  "main-queue",
  async (job: Job) => {
    switch (job.name) {
      case "create-shape":
        await prisma.shape.create({
          data: {
            ...job.data,
          },
        });
        break;
      case "update-shape":
        await prisma.shape.update({
          where: { id: job.data.id },
          data: { data: job.data.shape },
        });
        break;
      case "delete-shape":
        const shape = await prisma.shape.findUnique({
          where: { id: job.data.id },
          select: { roomId: true },
        });
        if (shape) {
          await prisma.shape.delete({
            where: { id: job.data.id },
          });
        }
        break;
      case "save-chat":
        await prisma.chat.create({
          data: {
            type: job.data.type,
            roomId: job.data.roomId,
            userId: job.data.userId,
            message: job.data.message,
          },
        });
        break;
      default:
        break;
    }
  },
  {
    connection: BullMQConnection,
    concurrency: 10,
  },
);

worker.on("failed", (job, err) => {
  console.error(`Shape ${job?.data?.id} failed after retries:`, err.message);
});
