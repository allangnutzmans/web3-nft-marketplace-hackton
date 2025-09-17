import React from 'react';
import { Loader2 } from 'lucide-react';
import StepContent from '../StepContent';

interface ProcessingStepProps {
  isWaitingForTx: boolean;
  txHash: string | null;
}

export default function ProcessingStep({ isWaitingForTx, txHash }: ProcessingStepProps) {
  return (
    <StepContent
      icon={<Loader2 className="w-16 h-16 animate-spin text-blue-500" />}
      title="Processing Purchase"
      description={
        isWaitingForTx
          ? "Waiting for transaction confirmation..."
          : "Starting transaction..."
      }
      txHash={txHash}
    />
  );
}
