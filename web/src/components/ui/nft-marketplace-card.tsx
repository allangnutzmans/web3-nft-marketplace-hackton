import Image from 'next/image';
import NFTCard from "@/components/ui/nft-card";
import { Button } from "@/components/ui/button";

interface NFTMarketplaceCardProps {
  name: string;
  imageSrc: string;
  altText: string;
  ownedBy: {
    name: string;
    avatar: string;
  };
  createdBy: {
    name: string;
    avatar: string;
  };
  price: {
    eth: string;
    usd: string;
  };
  onViewHistory?: () => void;
  onBuyNow?: () => void;
}

export default function NFTMarketplaceCard({
  name,
  imageSrc,
  altText,
  ownedBy,
  createdBy,
  price,
  onViewHistory,
  onBuyNow
}: NFTMarketplaceCardProps) {
  return (
    <div className="bg-blue-50/20 backdrop-blur-md border-4 border-white/20 rounded-3xl shadow-xl p-3 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white/50 p-2 rounded-2xl">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
            <Image
                src={ownedBy.avatar}
                alt={`${ownedBy.name} avatar`}
                width={32}
                height={32}
                className="rounded-full"
            />
            <div>
                <p className="text-xs text-gray-600">Owned by</p>
                <p className="text-sm font-medium text-gray-800">{ownedBy.name}</p>
            </div>
            </div>
            
            <div className="flex items-center gap-2">
            <div className="text-right">
                <p className="text-xs text-gray-600">Created by</p>
                <p className="text-sm font-medium text-gray-800">{createdBy.name}</p>
            </div>
            <Image
                src={createdBy.avatar}
                alt={`${createdBy.name} avatar`}
                width={32}
                height={32}
                className="rounded-full"
            />
            </div>
        </div>
        <NFTCard
            imageSrc={imageSrc}
            altText={name}
            captionText={name}
            />
      </div>

    {/* Price */}
    <div className="flex items-center justify-center my-1">
        <span className="text-sm font-bold text-gray-800">Price: </span>
        <span className="text-sm text-gray-800 px-2"> {price.eth} ETH</span>
        <span className="text-sm text-gray-600">X1</span>
        <span className="text-lg font-bold text-gray-800 px-2">=</span>
        <span className="text-sm font-bold text-gray-600">({price.usd})</span>
    </div>

      {/* Buttons */}
      <div className="flex bg-white/50 p-2 rounded-b-4xl rounded-t-xl gap-3">
        <Button
          variant="ghost"
          size="default"
          onClick={onViewHistory}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-tl-md rounded-tr-md rounded-br-md rounded-bl-3xl px-4 py-5"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
            />
          </svg>
          View history
        </Button>
        
        <Button
          onClick={onBuyNow}
          className="flex-1 bg-gray-800 text-white hover:bg-gray-900 rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-3xl font-medium px-6 py-5"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
