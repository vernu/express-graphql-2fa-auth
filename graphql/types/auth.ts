import { nullable, ObjectDefinitionBlock, objectType } from 'nexus/dist/core'
import { nonNull, stringArg } from 'nexus'

export const RegisterResponsePayload = objectType({
  name: 'RegisterResponsePayload',
  definition(t: ObjectDefinitionBlock<'RegisterResponsePayload'>) {
    t.nullable.field('user', {
      type: 'User',
    })
    t.nullable.string('accessToken')
  },
})

export const LoginResponsePayload = objectType({
  name: 'LoginResponsePayload',
  definition(t: ObjectDefinitionBlock<'LoginResponsePayload'>) {
    t.nullable.field('user', {
      type: 'User',
    })
    t.nullable.string('accessToken')
  },
})

export const ChangePasswordResponsePayload = objectType({
  name: 'ChangePasswordResponsePayload',
  definition(t: ObjectDefinitionBlock<'ChangePasswordResponsePayload'>) {
    t.boolean('success')
  },
})

export const Enable2FAResponsePayload = objectType({
  name: 'Enable2FAResponsePayload',
  definition(t: ObjectDefinitionBlock<'Enable2FAResponsePayload'>) {
    t.string('qrCodeUrl')
  },
})

export const Disable2FAResponsePayload = objectType({
  name: 'Disable2FAResponsePayload',
  definition(t: ObjectDefinitionBlock<'Disable2FAResponsePayload'>) {
    t.boolean('success')
  },
})

export const Verify2FAResponsePayload = objectType({
  name: 'Verify2FAResponsePayload',
  definition(t: ObjectDefinitionBlock<'Verify2FAResponsePayload'>) {
    t.boolean('success')
  },
})

export const RegisterArgs = {
  name: nonNull(stringArg()),
  email: nonNull(stringArg()),
  password: nonNull(stringArg()),
}

export const LoginArgs = {
  email: nonNull(stringArg()),
  password: nonNull(stringArg()),
  twoFactorAuthCode: nullable(stringArg()),
}

export const ChangePasswordArgs = {
  oldPassword: nonNull(stringArg()),
  newPassword: nonNull(stringArg()),
}

export const Enable2FAArgs = {}

export const Verify2FAArgs = {
  twoFactorAuthCode: nonNull(stringArg()),
}
