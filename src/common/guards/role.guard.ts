import { SetMetadata } from '@nestjs/common';
import { EUserRole } from 'generated/prisma';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
