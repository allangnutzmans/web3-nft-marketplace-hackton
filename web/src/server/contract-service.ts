import { createPublicClient, createWalletClient, http, getContract, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import nftMarketplace from '@/lib/contract/nft-marketplace';

const isProdBase = process.env.NEXT_PUBLIC_ENV === 'prod-base';

const chain = isProdBase
  ? {
      id: 84532,
      name: 'Base Sepolia',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: ['https://sepolia.base.org'] } },
    }
  : {
      id: 31337,
      name: 'Anvil Local',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: ['http://127.0.0.1:8545'] } },
    } as const;

const account = privateKeyToAccount(process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY as `0x${string}`);

// Public client to read
const publicClient = createPublicClient({
  chain,
  transport: http(chain.rpcUrls.default.http[0]),
});

const walletClient = createWalletClient({
  account,
  chain,
  transport: http(chain.rpcUrls.default.http[0]),
});
// Contract
const contract = getContract({
  address: nftMarketplace.address as `0x${string}`,
  abi: nftMarketplace.abi,
  client: { public: publicClient, wallet: walletClient },
});

export class ContractService {
  /**
   * Approve purchase and mint NFT
   */
  static async approvePurchase(buyerAddress: string, metadataUri: string) {
    try {
      console.log('Minting NFT for:', buyerAddress);
      console.log('Metadata URI:', metadataUri);

      // Call approvePurchase on contract
      const hash = await contract.write.approvePurchase([
        buyerAddress as `0x${string}`,
        metadataUri,
      ]);

      console.log('Transaction sent:', hash);

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction confirmed in block:', receipt.blockNumber);

      // Extract token ID from logs (Transfer event)
      let tokenId = 0;
      const transferLog = receipt.logs.find(log => 
        log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      );
      
      if (transferLog && transferLog.topics[3]) {
        tokenId = parseInt(transferLog.topics[3], 16);
      }

      return {
        success: true,
        txHash: hash,
        tokenId,
        blockNumber: receipt.blockNumber.toString(),
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw new Error(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reject purchase and make refund
   */
  static async rejectPurchase(buyerAddress: string, amount: string) {
    try {
      console.log('Refunding to:', buyerAddress);
      console.log('Amount:', amount, 'ETH');

      // Convert amount to wei
      const amountWei = parseEther(amount);

      // Call rejectPurchase on contract
      const hash = await contract.write.rejectPurchase([
        buyerAddress as `0x${string}`,
        amountWei,
      ]);

      console.log('Refund transaction sent:', hash);

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Refund confirmed in block:', receipt.blockNumber);

      return {
        success: true,
        txHash: hash,
        blockNumber: receipt.blockNumber.toString(),
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error(`Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
