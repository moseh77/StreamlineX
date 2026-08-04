import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { withAccelerate } from "@prisma/extension-accelerate"

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }

  if (databaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl }).$extends(
      withAccelerate()
    ) as unknown as PrismaClient
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}
