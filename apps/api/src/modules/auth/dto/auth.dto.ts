import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  EDUCATOR = 'EDUCATOR',
  PARENT = 'PARENT',
  STAFF = 'STAFF',
}

export class LoginDto {
  @ApiProperty({ 
    example: 'marie@kidverse.com',
    description: 'Email de l\'utilisateur' 
  })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({ 
    example: 'SecurePassword123!',
    description: 'Mot de passe' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ 
    example: 'marie@kidverse.com',
    description: 'Email de l\'utilisateur' 
  })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({ 
    example: 'SecurePassword123!',
    description: 'Mot de passe (min 8 caractères)' 
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    { message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' }
  )
  password: string;

  @ApiProperty({ 
    example: 'Marie',
    description: 'Prénom' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ 
    example: 'Dupont',
    description: 'Nom de famille' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ 
    enum: UserRole,
    example: UserRole.PARENT,
    description: 'Rôle de l\'utilisateur' 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ 
    example: '+1 514 555 1234',
    description: 'Numéro de téléphone' 
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    example: 'fr',
    description: 'Langue préférée (fr ou en)' 
  })
  @IsString()
  @IsOptional()
  preferredLanguage?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de rafraîchissement' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class TokenResponseDto {
  @ApiProperty({ description: 'Token d\'accès JWT' })
  accessToken: string;

  @ApiProperty({ description: 'Token de rafraîchissement' })
  refreshToken: string;

  @ApiProperty({ example: 'Bearer', description: 'Type de token' })
  tokenType: string;

  @ApiProperty({ example: 604800, description: 'Durée de validité en secondes' })
  expiresIn: number;

  @ApiProperty({ description: 'Informations utilisateur' })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}


