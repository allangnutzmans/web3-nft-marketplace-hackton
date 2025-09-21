'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/trpc';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Copy } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPurchasesPage() {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const { data: pendingPurchases, refetch } = api.purchase.getPendingPurchases.useQuery();

  const approveMutation = api.purchase.approvePurchase.useMutation({
    onSuccess: async (data) => {
      toast.success(data.message);
      await refetch();
      
      // Transaction info
      if (data.contractResult) {
        toast.info(
          <div className="space-y-2">
            <p><strong>🎉 NFT Minted!</strong></p>
            <p>Token ID: <strong>{data.contractResult.tokenId}</strong></p>
            <p>Tx: <code className="text-xs">{data.contractResult.txHash}</code></p>
            <p>Youcan now!</p>
          </div>,
          { duration: 8000 }
        );
      }
    },
    onError: (error) => {
      toast.error(`Error approving: ${error.message}`);
    },
    onSettled: (_, __, variables) => {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.purchaseId);
        return newSet;
      });
    }
  });

  const rejectMutation = api.purchase.rejectPurchase.useMutation({
    onSuccess: async (data) => {
      toast.success(data.message);
      await refetch();
      
      // Transaction info
      if (data.contractResult) {
        toast.info(
          <div className="space-y-2">
            <p><strong>💰 Refund Processed!</strong></p>
            <p>Tx: <code className="text-xs">{data.contractResult.txHash}</code></p>
            <p>ETH was returned to the user&apos;s wallet!</p>
          </div>,
          { duration: 8000 }
        );
      }
    },
    onError: (error) => {
      toast.error(`Error rejecting: ${error.message}`);
    },
    onSettled: (_, __, variables) => {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.purchaseId);
        return newSet;
      });
    }
  });

  const handleApprove = (purchaseId: string) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    approveMutation.mutate({ purchaseId });
  };

  const handleReject = (purchaseId: string) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    rejectMutation.mutate({ purchaseId });
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container min-h-[calc(100vh-8.5rem)] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Purchases
        </h1>
        <p className="text-gray-600">
          Approve or reject pending NFT purchases
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingPurchases?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List of pending purchases */}
      <div className="space-y-6">
        {pendingPurchases?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending purchases
              </h3>
              <p className="text-gray-600">
                All purchases have been processed or there are no purchases at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          pendingPurchases?.map((purchase) => (
            <Card key={purchase.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>Purchase #{purchase.id.slice(-8)}</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3 mr-1" />
                        PENDING
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(purchase.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {purchase.amount.toString()} ETH
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Purchase information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Buyer</h4>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {purchase.buyerAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(purchase.buyerAddress)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">NFT</h4>
                    <p className="text-sm text-gray-600">
                      CID: {purchase.nftItem.metadataCid}
                    </p>
                  </div>
                </div>

                {purchase.txHash && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Transaction Hash</h4>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {purchase.txHash}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(purchase.txHash!)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(purchase.id)}
                    disabled={processingIds.has(purchase.id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {processingIds.has(purchase.id) ? 'Approving...' : 'Approve'}
                  </Button>
                  
                  <Button
                    onClick={() => handleReject(purchase.id)}
                    disabled={processingIds.has(purchase.id)}
                    variant="destructive"
                    className="flex items-center gap-2 text-white"
                  >
                    <XCircle className="w-4 h-4" />
                    {processingIds.has(purchase.id) ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
