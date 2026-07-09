// import { Job, Worker } from "bullmq";
// import { BullMQConnection } from "../config/Queue";
// import { prisma } from "@repo/db";

// const worker = new Worker(
//   "main-queue",
//   async (job: Job) => {
//     switch (job.name) {
//       case "save-chat":
        
//         await prisma.chat.create({
//           data: {
//             type:job.data.type,
//             roomId: job.data.roomId,
//             userId:job.data.userId,
//             message:job.data.message
//           },
//         });
//         break;
//       default:
//         break;
//     }
//   },
//   { connection: BullMQConnection, concurrency: 10 },
// );

// worker.on("failed", (job, err) => {
//   console.error(`Shape ${job?.data?.id} failed after retries:`, err.message);
// });
