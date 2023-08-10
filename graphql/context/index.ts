import { PrismaClient } from '@prisma/client'
import prismaClient from '../../prisma/prismaClient'
import { verifyToken } from '../../utils'

export type Context = {
  prismaClient: PrismaClient
  user: any
}

const getLoggedInUser = async (req: any) => {
  try {
    const token = req.headers?.authorization?.split(' ')[1]
    const userId = (await verifyToken(token))?.id
    if (!userId) {
      return null
    }
    return await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

export const createContext = async ({ req, res }: any): Promise<Context> => {
  return {
    prismaClient,
    user: await getLoggedInUser(req),
  }
}
