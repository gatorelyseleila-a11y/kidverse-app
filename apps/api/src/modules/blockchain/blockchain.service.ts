import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initializeProvider();
  }

  private initializeProvider() {
    const enabled = this.configService.get('blockchain.enabled');
    if (!enabled) {
      this.logger.log('Blockchain features disabled');
      return;
    }

    const rpcUrl = this.configService.get('blockchain.polygonRpcUrl');
    const privateKey = this.configService.get('blockchain.walletPrivateKey');

    if (rpcUrl && privateKey) {
      try {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.logger.log('Blockchain provider initialized');
      } catch (error) {
        this.logger.error('Failed to initialize blockchain provider', error);
      }
    }
  }

  async getWalletAddress(): Promise<string | null> {
    return this.wallet?.address || null;
  }

  async getBalance(): Promise<string | null> {
    if (!this.wallet || !this.provider) return null;
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  /**
   * Enregistrer un consentement parental sur la blockchain
   */
  async recordConsent(data: {
    childId: string;
    parentId: string;
    consentType: string;
    granted: boolean;
  }): Promise<string | null> {
    if (!this.wallet) return null;

    // TODO: Interact with smart contract
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify({
        ...data,
        timestamp: Date.now(),
      }))
    );

    this.logger.log(`Consent recorded: ${hash}`);
    return hash;
  }

  /**
   * Vérifier une transaction
   */
  async verifyTransaction(txHash: string): Promise<any> {
    if (!this.provider) return null;
    return this.provider.getTransaction(txHash);
  }

  /**
   * Créer une identité numérique pour un enfant
   */
  async createDigitalIdentity(childId: string): Promise<string | null> {
    // TODO: Mint NFT identity token
    const identityHash = ethers.keccak256(
      ethers.toUtf8Bytes(`kidverse:identity:${childId}:${Date.now()}`)
    );
    return identityHash;
  }
}


