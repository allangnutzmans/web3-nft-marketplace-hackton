import { decodeErrorResult } from 'viem';
import nftMarketplace from './contract/nft-marketplace';

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

// --- helpers ---
function isErrorWithData(error: unknown): error is { data: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as any).data === 'string' &&
    (error as any).data.startsWith('0x')
  );
}

function isErrorWithName(error: unknown): error is { name: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    typeof (error as any).name === 'string'
  );
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

// --- main decoder ---
export function getErrorMessage(error: unknown): string {
  try {
    // 1. Contract errors (decoded)
    if (isErrorWithData(error)) {
      try {
        const decoded = decodeErrorResult({
          abi: nftMarketplace.abi,
          data: error.data as `0x${string}`,
        });
        return (
          ERROR_MESSAGES[decoded.errorName] ??
          decoded.errorName ??
          'Contract execution failed'
        );
      } catch {
        // fall through
      }
    }

    // 2. Named errors
    if (isErrorWithName(error)) {
      return ERROR_MESSAGES[error.name] ?? error.name;
    }

    // 3. Message pattern matching
    if (isErrorWithMessage(error)) {
      const msg = error.message.toLowerCase();
      if (msg.includes('gas')) return 'Transaction failed - gas estimation error';
      if (msg.includes('insufficient funds')) return 'Not enough funds for transaction';
      if (msg.includes('user rejected')) return 'Transaction was cancelled';
      if (msg.includes('network') || msg.includes('connection') || msg.includes('rpc')) {
        return 'Network error - please try again';
      }
      return error.message;
    }

    // 4. Fallback
    return 'An unexpected error occurred';
  } catch {
    return 'An unexpected error occurred';
  }
}
