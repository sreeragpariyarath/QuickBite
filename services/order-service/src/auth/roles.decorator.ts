import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Array<'CUSTOMER' | 'OWNER'>) =>
  SetMetadata(ROLES_KEY, roles);
