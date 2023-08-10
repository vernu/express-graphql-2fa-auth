import bcrypt from 'bcryptjs'

import { Context } from '../context'
import { generateToken } from '../../utils'

export const registerResolver = async (_root: any, args: any, ctx: Context) => {
  const hashedPassword = bcrypt.hashSync(args.password, 10)
  const user = await ctx.prismaClient.user.create({
    data: {
      name: args.name,
      email: args.email,
      password: hashedPassword,
    },
  })
  return {
    user,
    accessToken: generateToken(user.id),
  }
}

export const loginResolver = async (_root: any, args: any, ctx: Context) => {
  const user = await ctx.prismaClient.user.findUnique({
    where: {
      email: args.email,
    },
  })

  const validCredentials =
    user && (await bcrypt.compare(args.password, user.password ?? ''))

  if (!validCredentials) {
    throw new Error('Invalid credentials')
  }

  return {
    user,
    accessToken: generateToken(user.id),
  }
}

export const changePasswordResolver = async (
  _root: any,
  args: any,
  ctx: Context
) => {
  if (!ctx.user) {
    throw new Error('Not authenticated')
  }

  const user = await ctx.prismaClient.user.findUnique({
    where: {
      id: ctx.user.id,
    },
  })
  const validCredentials =
    user && (await bcrypt.compare(args.oldPassword, user.password ?? ''))

  if (!validCredentials) {
    throw new Error('Invalid credentials')
  }
  const newHashedPassword = bcrypt.hashSync(args.newPassword, 10)
  await ctx.prismaClient.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      password: newHashedPassword,
    },
  })
  return {
    success: true,
  }
}
