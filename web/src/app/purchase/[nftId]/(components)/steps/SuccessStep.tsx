import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import StepContent from '../StepContent';

interface SuccessStepProps {
  txHash: string | null;
  onGoHome: () => void;
  onViewPurchases: () => void;
}

export default function SuccessStep({ txHash, onGoHome, onViewPurchases }: SuccessStepProps) {
  return (
    <StepContent
      icon={<CheckCircle className="w-16 h-16 text-green-500" />}
      title="Purchase Successful!"
      description="Your transaction was confirmed successfully. Your purchase is being analyzed. You will receive a notification when the process is completed."
      txHash={txHash}
      actions={
        <>
          <Link href="/">
            <Button variant="outline" onClick={onGoHome}>
              Home
            </Button>
          </Link>
          <Button onClick={onViewPurchases}>
            View my purchases
          </Button>
        </>
      }
    />
  );
}
