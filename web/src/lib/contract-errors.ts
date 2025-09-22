import { decodeErrorResult } from 'viem';
import nftMarketplace from './contract/nft-marketplace';

// Error message mapping for contract and viem errors
export const ERROR_MESSAGES: Record<string, string> = {
  // Custom PetNft errors
  NeedEthToPurchase: 'ETH is required to make a purchase',
  RefundFailed: 'Failed to process refund - user wallet may not accept ETH transfers',

  // ERC721 standard errors
  ERC721IncorrectOwner: 'Incorrect token owner',
  ERC721InsufficientApproval: 'Insufficient approval for token transfer',
  ERC721InvalidApprover: 'Invalid approver address',
  ERC721InvalidOperator: 'Invalid operator address',
  ERC721InvalidOwner: 'Invalid owner address',
  ERC721InvalidReceiver: 'Invalid receiver address',
  ERC721InvalidSender: 'Invalid sender address',
  ERC721NonexistentToken: 'Token does not exist',

  // Access control errors
  OwnableInvalidOwner: 'Invalid contract owner',
  OwnableUnauthorizedAccount: 'Only the contract owner can perform this action',

  // Viem errors
  ContractFunctionExecutionError: 'Transaction failed to execute on the blockchain',
  TransactionExecutionError: 'Transaction execution failed',
  InsufficientFundsError: 'Not enough funds to complete the transaction',
  UserRejectedRequestError: 'Transaction was cancelled',
};

// Simple error decoder
export function getErrorMessage(error: any): string {
  try {
    // 1. Handle contract errors
    if (error?.data) {
      try {
        const decoded = decodeErrorResult({
          abi: nftMarketplace.abi,
          data: error.data,
        });
        const contractMessage = ERROR_MESSAGES[decoded.errorName];
        if (contractMessage) return contractMessage;
        if (decoded.errorName) return decoded.errorName;
        return 'Contract execution failed';
      } catch {
        // Continue to other checks
      }
    }

    // 2. Handle named errors
    if (error?.name) {
      const namedMessage = ERROR_MESSAGES[error.name];
      if (namedMessage) return namedMessage;
    }

    // 3. Handle message patterns
    if (error?.message) {
      const message = error.message.toLowerCase();

      if (message.includes('gas') || message.includes('out of gas')) {
        return 'Transaction failed - gas estimation error';
      }
      if (message.includes('insufficient funds')) {
        return 'Not enough funds for transaction';
      }
      if (message.includes('user rejected')) {
        return 'Transaction was cancelled';
      }
      if (message.includes('network') || message.includes('connection') || message.includes('rpc')) {
        return 'Network error - please try again';
      }
    }

    // 4. Return original message or fallback
    return error?.message || 'An unexpected error occurred';
  } catch {
    return 'An unexpected error occurred';
  }
}
