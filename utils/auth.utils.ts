import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import speakeasy, { GeneratedSecret } from 'speakeasy'

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '90d',
    }
  )
}

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hashSync(password, 10)
}

export const generateOtpSecret = (): GeneratedSecret => {
  return speakeasy.generateSecret({
    name: 'wXw',
  })
}

export const verifyOtpCode = (code: string, secret: string): boolean => {
  // Remove spaces from the 2FA code
  let cleanCode = code.replace(/\s/g, '')

  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: cleanCode,
  })
}
