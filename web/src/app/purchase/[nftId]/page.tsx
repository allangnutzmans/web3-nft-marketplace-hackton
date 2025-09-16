'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ArrowLeft, Wallet, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/trpc";
import { toast } from "sonner";
import nftMarketplace from '@/lib/contract/nft-marketplace';
import NetworkSwitcher from '@/components/NetworkSwitcher';

interface PurchasePageProps {
  params: {
    nftId: string;
  };
}

// TODO: SUBPAGES / components (client), NOT SWITCH - ASK

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'confirm':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go back to home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Buy NFT</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Imagem do NFT */}
              <div>
                <Card className='max-w-[600px]'>
                  <CardContent className="p-6">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 items-center justify-center">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{nft.name}</h2>
                    {nft.description && (
                      <p className="text-gray-600 text-sm">{nft.description}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Detalhes da compra */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-2xl font-bold">{nft.price} ETH</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Network fee:</span>
                      <span className="text-sm text-gray-500">Calculated automatically</span>
                    </div>

                    <hr />

                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>{nft.price} ETH + fees</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Aviso importante */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-1">Important</h3>
                        <p className="text-sm text-yellow-700">
                          After the purchase, your transaction will be analyzed. If approved, the NFT will be
                          minted and sent to your wallet. If rejected, the value will be returned
                          automatically.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Network Switcher */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-1">Network Check</h3>
                        <p className="text-sm text-blue-700">
                          Make sure you're connected to Anvil Local network
                        </p>
                      </div>
                      <NetworkSwitcher />
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet status */}
                {!isConnected && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-700">
                          You need to connect your wallet to continue.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Purchase button */}
                <Button
                  onClick={handlePurchase}
                  disabled={!isConnected || isWriting}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  {isWriting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Purchase</h2>
              <p className="text-gray-600 mb-4">
                {isWaitingForTx ? "Waiting for transaction confirmation..." : "Starting transaction..."}
              </p>
              {txHash && (
                <p className="text-xs text-gray-500 break-all max-w-md">
                  Hash: {txHash}
                </p>
              )}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Your transaction was confirmed successfully. Your purchase is being analyzed.
                You will receive a notification when the process is completed.
              </p>
              {txHash && (
                <p className="text-xs text-gray-500 break-all max-w-md mb-6">
                  Transaction hash: {txHash}
                </p>
              )}
              <div className="space-x-4">
                <Link href="/">
                  <Button variant="outline">Go back to home</Button>
                </Link>
                <Button onClick={() => router.push('/my-purchases')}>
                  View my purchases
                </Button>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <XCircle className="w-16 h-16 text-red-500" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error in Purchase</h2>
              <p className="text-gray-600 mb-6">
                An error occurred while processing your purchase. Try again.
              </p>
              <div className="space-x-4">
                <Link href="/">
                  <Button variant="outline">Go back to home</Button>
                </Link>
                <Button onClick={() => setCurrentStep('confirm')}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      <div className="container mx-auto px-4 py-8 border max-h-[calc(100vh-8.5rem)]">
        {renderStepContent()}
      </div>
    </div>
  );
}
