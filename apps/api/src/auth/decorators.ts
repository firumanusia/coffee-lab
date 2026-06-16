import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Role } from '@prisma/client'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

export interface AuthUser {
  userId: string
  email: string
  role: Role
}

/** Injects the authenticated user (set by JwtStrategy.validate). */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  return ctx.switchToHttp().getRequest().user
})
