import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marquer une route comme publique (sans authentification requise)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


