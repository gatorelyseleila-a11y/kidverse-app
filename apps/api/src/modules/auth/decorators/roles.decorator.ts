import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../dto/auth.dto';

export const ROLES_KEY = 'roles';

/**
 * Définir les rôles requis pour accéder à une route
 * @param roles Liste des rôles autorisés
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);


