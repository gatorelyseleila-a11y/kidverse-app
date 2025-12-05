import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth.dto';

@ApiTags('blockchain')
@Controller('blockchain')
@ApiBearerAuth('JWT-auth')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtenir le statut du service blockchain' })
  async getStatus() {
    const address = await this.blockchainService.getWalletAddress();
    const balance = await this.blockchainService.getBalance();
    
    return {
      enabled: !!address,
      walletAddress: address,
      balance,
    };
  }

  @Post('consent')
  @ApiOperation({ summary: 'Enregistrer un consentement sur la blockchain' })
  async recordConsent(@Body() data: {
    childId: string;
    parentId: string;
    consentType: string;
    granted: boolean;
  }) {
    const hash = await this.blockchainService.recordConsent(data);
    return { hash, recorded: !!hash };
  }
}


