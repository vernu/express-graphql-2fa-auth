import { ObjectDefinitionBlock, objectType } from 'nexus/dist/core'
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

export const RegisterArgs = {
  name: nonNull(stringArg()),
  email: nonNull(stringArg()),
  password: nonNull(stringArg()),
}

export const LoginArgs = {
  email: nonNull(stringArg()),
  password: nonNull(stringArg()),
}

export const ChangePasswordArgs = {
  oldPassword: nonNull(stringArg()),
  newPassword: nonNull(stringArg()),
}
