import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type UserRoleType =
  | 'CUSTOMER'
  | 'OWNER'
  | 'SUPER_ADMIN'
  | 'MANAGER'
  | 'CASHIER'
  | 'KITCHEN_STAFF'
  | 'DRIVER';

export const Roles = (...roles: UserRoleType[]) =>
  SetMetadata(ROLES_KEY, roles);

