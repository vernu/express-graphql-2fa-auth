import QRCode from 'qrcode'
import { Context } from '../context'
import {
  generateAccessToken,
  generateOtpSecret,
  hashPassword,
  verifyOtpCode,
  verifyPassword,
} from '../../utils/auth.utils'

export const registerResolver = async (_root: any, args: any, ctx: Context) => {
  const hashedPassword = await hashPassword(args.password)
  const user = await ctx.prismaClient.user.create({
    data: {
      name: args.name,
      email: args.email,
      password: hashedPassword,
    },
  })
  return {
    user,
    accessToken: generateAccessToken(user.id),
  }
}

export const loginResolver = async (
  _root: any,
  args: {
    email: string
    twoFactorAuthCode?: any
    password: string
  },
  ctx: Context
) => {
  const user = await ctx.prismaClient.user.findUnique({
    where: {
      email: args.email,
    },
  })

  if (user?.twoFactorAuthEnabled && !args.twoFactorAuthCode) {
    throw new Error('2FA code required')
  }

  const validCredentials = await verifyPassword(
    args.password,
    user?.password ?? ''
  )

  if (!user || !validCredentials) {
    throw new Error('Invalid credentials')
  }

  if (user.twoFactorAuthEnabled) {
    const verified = await verifyOtpCode(
      args.twoFactorAuthCode,
      user.twoFactorAuthSecret ?? ''
    )

    if (!verified) {
      throw new Error('Invalid 2FA code')
    }
  }

  return {
    user,
    accessToken: generateAccessToken(user.id),
  }
}

export const changePasswordResolver = async (
  _root: any,
  args: { oldPassword: string; newPassword: string },
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
  const validCredentials = await verifyPassword(
    args.oldPassword,
    user?.password ?? ''
  )
  if (!validCredentials) {
    throw new Error('Invalid credentials')
  }

  const newHashedPassword = await hashPassword(args.newPassword)

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

export const enable2FAResolver = async (
  _root: any,
  _args: any,
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

  if (user?.twoFactorAuthEnabled) {
    throw new Error('2FA already enabled')
  }

  const secret = generateOtpSecret()

  await ctx.prismaClient.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      twoFactorAuthSecret: secret.base32,
    },
  })

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url ?? '')

  return {
    qrCodeUrl,
  }
}

export const verify2FAResolver = async (
  _root: any,
  args: { twoFactorAuthCode: string },
  ctx: Context
) => {
  if (!ctx.user) {
    throw new Error('Not authenticated')
  }

  const twoFactorAuthCode = args.twoFactorAuthCode
  const user = await ctx.prismaClient.user.findUnique({
    where: {
      id: ctx.user.id,
    },
  })

  const verified = await verifyOtpCode(
    twoFactorAuthCode,
    user?.twoFactorAuthSecret ?? ''
  )

  if (verified) {
    await ctx.prismaClient.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        twoFactorAuthEnabled: true,
      },
    })
  }

  return {
    success: verified,
  }
}

export const disable2FAResolver = async (
  _root: any,
  _args: any,
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

  if (user?.twoFactorAuthEnabled === false) {
    throw new Error('2FA not enabled')
  }

  await ctx.prismaClient.user.update({
    where: {
      id: ctx.user.id,
    },
    data: { twoFactorAuthEnabled: false },
  })

  return {
    success: true,
  }
}
