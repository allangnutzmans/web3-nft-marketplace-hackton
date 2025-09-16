'use client'

import React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/trpc";

export default function MyPurchasesPage() {
  const { address, isConnected } = useAccount();

  const { data: purchasesData, isLoading } = api.purchase.getByAddress.useQuery(
    {
      buyerAddress: address || '',
      page: 1,
      limit: 20
    },
    {
      enabled: !!address && isConnected
    }
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Aguardando análise';
      case 'APPROVED':
        return 'Aprovado - NFT mintado';
      case 'REJECTED':
        return 'Rejeitado - Valor devolvido';
      default:
        return status;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Conecte sua wallet</h1>
          <p className="text-gray-600 mb-6">
            Você precisa conectar sua wallet para ver suas compras.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Compras</h1>
            <p className="text-gray-600">Acompanhe o status das suas compras de NFTs</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Package className="w-8 h-8 animate-pulse text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Carregando suas compras...</p>
            </div>
          </div>
        ) : !purchasesData?.purchases.length ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma compra encontrada</h2>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhuma compra. Que tal explorar nossos NFTs?
            </p>
            <Link href="/">
              <Button>Explorar NFTs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchasesData.purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Compra NFT</h3>
                        <p className="text-sm text-gray-600">
                          Valor: {purchase.amount.toString()} ETH
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(purchase.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {purchase.txHash && (
                          <p className="text-xs text-gray-400 font-mono">
                            TX: {purchase.txHash.slice(0, 10)}...{purchase.txHash.slice(-8)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(purchase.status)} mb-2`}
                      >
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(purchase.status)}
                          <span>{getStatusText(purchase.status)}</span>
                        </span>
                      </Badge>
                      {purchase.tokenId && (
                        <p className="text-xs text-gray-500">
                          Token ID: #{purchase.tokenId}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Paginação simples */}
            {purchasesData.pagination.totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <p className="text-sm text-gray-600">
                  Página {purchasesData.pagination.page} de {purchasesData.pagination.totalPages}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
