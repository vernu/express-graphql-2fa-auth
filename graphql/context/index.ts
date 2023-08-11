import { PrismaClient, User } from '@prisma/client'
import prismaClient from '../../prisma/prismaClient'
import { verifyAccessToken } from '../../utils/auth.utils'

export type Context = {
  prismaClient: PrismaClient
  user: User | null
}

const getLoggedInUser = async (req: any): Promise<User | null> => {
  try {
    const token = req.headers?.authorization?.split(' ')[1]
    const userId = (await verifyAccessToken(token))?.id
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
