import { extendType } from 'nexus'

import {
  registerResolver,
  loginResolver,
  changePasswordResolver,
  enable2FAResolver,
  verify2FAResolver,
  disable2FAResolver,
} from '../resolvers'
import {
  RegisterArgs,
  LoginArgs,
  ChangePasswordArgs,
  Enable2FAArgs,
  Verify2FAArgs,
} from '../types'

export const register = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('register', {
      type: 'RegisterResponsePayload',
      args: RegisterArgs,
      resolve: registerResolver,
    })
  },
})

export const Login = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'LoginResponsePayload',
      args: LoginArgs,
      resolve: loginResolver,
    })
  },
})

export const ChangePassword = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('changePassword', {
      type: 'ChangePasswordResponsePayload',
      args: ChangePasswordArgs,
      resolve: changePasswordResolver,
    })
  },
})

export const Enable2FA = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('enable2FA', {
      type: 'Enable2FAResponsePayload',
      args: Enable2FAArgs,
      resolve: enable2FAResolver,
    })
  },
})

export const Disble2FA = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('disable2FA', {
      type: 'Disable2FAResponsePayload',
      resolve: disable2FAResolver,
    })
  },
})

export const Verify2FA = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('verify2FA', {
      type: 'Verify2FAResponsePayload',
      args: Verify2FAArgs,
      resolve: verify2FAResolver,
    })
  },
})
