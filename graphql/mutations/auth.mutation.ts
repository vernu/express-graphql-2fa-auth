import { extendType } from 'nexus'
import { Context } from '../context'
import {
  registerResolver,
  loginResolver,
  changePasswordResolver,
} from '../resolvers'
import { RegisterArgs, LoginArgs, ChangePasswordArgs } from '../types'

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
