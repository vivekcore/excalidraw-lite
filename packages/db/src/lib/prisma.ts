
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
import { PrismaClient } from '../generated/prisma/client.js'

neonConfig.webSocketConstructor = ws

const createPrismaClient = () => {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  })

  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export * from '@prisma/client' 






// import { PrismaClient } from "../generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config"
// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
//   max: 5,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 10000,
// });

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ?? new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
