import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wallet, Loader2, ArrowLeft, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NetworkSwitcher from '@/components/NetworkSwitcher';
import StepContent from '../StepContent';

interface ConfirmStepProps {
  nft: {
    id: string;
    name: string;
    description?: string;
    image: string;
    price: string;
  };
  isConnected: boolean;
  isWriting: boolean;
  onPurchase: () => void;
}

export default function ConfirmStep({ nft, isConnected, isWriting, onPurchase }: ConfirmStepProps) {
  return (
    <StepContent title="Buy NFT">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back to home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
        {/* NFT Image */}
        <div>
          <Card className="max-w-[600px]">
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

        {/* Purchase details */}
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

          {/* Warning */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">Important</h3>
                  <p className="text-sm text-yellow-700">
                    After the purchase, your transaction will be analyzed. If approved, the NFT will be
                    minted and sent to your wallet. If rejected, the value will be returned automatically.
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

          {/* Wallet warning */}
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
            onClick={onPurchase}
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
    </StepContent>
  );
}
