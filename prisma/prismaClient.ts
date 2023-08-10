import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaClient: PrismaClient }

const prismaClient =
  globalForPrisma.prismaClient ||
  new PrismaClient({
    log: [],
  })

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prismaClient = prismaClient

export default prismaClient
