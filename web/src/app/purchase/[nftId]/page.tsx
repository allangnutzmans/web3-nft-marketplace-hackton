'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc";
import { toast } from "sonner";
import nftMarketplace from '@/lib/contract/nft-marketplace';
import ConfirmStep from './(components)/steps/ConfirmStep';
import ProcessingStep from './(components)/steps/ProcessingStep';
import SuccessStep from './(components)/steps/SuccessStep';
import ErrorStep from './(components)/steps/ErrorStep';

interface PurchasePageProps {
  params: {
    nftId: string;
  };
}

type PurchaseStep = 'confirm' | 'processing' | 'success' | 'error';

export default function PurchasePage({ params }: PurchasePageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PurchaseStep>('confirm');
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { writeContract, isPending: isWriting } = useWriteContract();

  const { data: txReceipt, isLoading: isWaitingForTx } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  // Buscar dados do NFT
  const { data: nftsData, isLoading: isLoadingNft } = api.nft.list.useQuery();
  const nft = nftsData?.find(n => n.id === params.nftId);

  const createPurchaseMutation = api.purchase.create.useMutation({
    onSuccess: () => {
      toast.success("Purchase registered successfully!");
    },
    onError: (error) => {
      toast.error(`Erro ao registrar purchase: ${error.message}`);
    }
  });

  const handlePurchase = async () => {
    if (!nft || !address || !isConnected) {
      toast.error("Connect your wallet first");
      return;
    }

    try {
      setCurrentStep('processing');

      // Call requestPurchase function from contract
      writeContract({
        address: nftMarketplace.address as `0x${string}`,
        abi: nftMarketplace.abi,
        functionName: 'requestPurchase',
        value: parseEther(nft.price),
      }, {
        onSuccess: (hash) => {
          setTxHash(hash);

          // Register purchase in backend
          createPurchaseMutation.mutate({
            nftItemId: nft.id,
            buyerAddress: address,
            amount: parseFloat(nft.price),
            txHash: hash,
          });
        },
        onError: (error) => {
          console.error("Transaction error:", error);
          setCurrentStep('error');
          toast.error("Error processing transaction");
        }
      });

    } catch (error) {
      console.error("Error starting purchase:", error);
      setCurrentStep('error');
      toast.error("Error starting purchase");
    }
  };

  // Monitor transaction status
  React.useEffect(() => {
    if (txReceipt) {
      if (txReceipt.status === 'success') {
        setCurrentStep('success');
        toast.success("Transaction confirmed! Wait for purchase analysis.");
      } else {
        setCurrentStep('error');
        toast.error("Transaction failed");
      }
    }
  }, [txReceipt]);

  if (isLoadingNft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading NFT...</span>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">NFT not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

return (
    <div className="h-full">
      <div className="container mx-auto px-4 py-8 max-h-[calc(100vh-8.5rem)]">
        {currentStep === 'confirm' && (
          <ConfirmStep
            nft={nft}
            isConnected={isConnected}
            isWriting={isWriting}
            onPurchase={handlePurchase}
          />
        )}
        {currentStep === 'processing' && (
          <ProcessingStep
            isWaitingForTx={isWaitingForTx}
            txHash={txHash}
          />
        )}
        {currentStep === 'success' && (
          <SuccessStep
            txHash={txHash}
            onGoHome={() => router.push('/')}
            onViewPurchases={() => router.push('/my-purchases')}
          />
        )}
        {currentStep === 'error' && (
          <ErrorStep
            onRetry={() => setCurrentStep('confirm')}
            onGoHome={() => router.push('/')}
          />
        )}
      </div>
    </div>
  );
}
