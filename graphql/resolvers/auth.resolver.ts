import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
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

  if (user?.twoFactorAuthEnabled && !args.twoFactorAuthCode) {
    throw new Error('2FA code required')
  }

  const validCredentials =
    user && (await bcrypt.compare(args.password, user.password ?? ''))

  if (!validCredentials) {
    throw new Error('Invalid credentials')
  }

  if (user.twoFactorAuthEnabled) {
    const verified = speakeasy.totp.verify({
      secret: user?.twoFactorAuthSecret ?? '',
      encoding: 'base32',
      token: args.twoFactorAuthCode ?? '',
    })

    if (!verified) {
      throw new Error('Invalid 2FA code')
    }
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

export const enable2FAResolver = async (
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

  if (user?.twoFactorAuthEnabled) {
    throw new Error('2FA already enabled')
  }

  const secret = speakeasy.generateSecret()

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
  args: any,
  ctx: Context
) => {
  if (!ctx.user) {
    throw new Error('Not authenticated')
  }

  let twoFactorAuthCode = args.twoFactorAuthCode
  // Remove spaces from the 2FA code
  twoFactorAuthCode = twoFactorAuthCode.replace(/\s/g, '')

  const user = await ctx.prismaClient.user.findUnique({
    where: {
      id: ctx.user.id,
    },
  })

  const verified = speakeasy.totp.verify({
    secret: user?.twoFactorAuthSecret ?? '',
    encoding: 'base32',
    token: twoFactorAuthCode,
  })

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
