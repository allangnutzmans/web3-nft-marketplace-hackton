import Image from 'next/image';
import NFTCard from "@/components/ui/nft-card";
import { Button } from "@/components/ui/button";

interface NFTMarketplaceCardProps {
  name: string;
  description: string;
  imageSrc: string;
  altText: string;

  price: {
    eth: string;
    usd: string;
  };
  onBuyNow?: () => void;
}

export default function NFTMarketplaceCard({
  name,
  imageSrc,
  description,
  price,
  onBuyNow
}: NFTMarketplaceCardProps) {
  return (
    <div className="bg-blue-50/20 backdrop-blur-md border-4 border-white/20 rounded-3xl shadow-xl p-2 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white/50 p-2 rounded-2xl ">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs text-gray-600">Unlimited</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-600">Picture based</p>
            </div>
          </div>
        </div>
        <div className='bg-secondary rounded-lg'>
          <NFTCard
            imageSrc={imageSrc}
            altText={name}
            captionText={name}
          />

          <div className='mx-2 px-2 py-1 font-medium max-w-[240px]'>
            <div className='text-primary'>{name}</div>
            <span className='text-gray-600 text-xs block truncate '>{description}</span>
          </div>
        </div>
      </div>

      <div className="flex bg-white/50 p-2 rounded-b-4xl rounded-t-xl gap-3 my-2">
        {/* Price */}
        <div className="flex items-center justify-center ms-4">
          <div className="flex flex-col items-center">
            <div className="font-bold text-gray-800 px-2"> {price.eth} ETH</div>
            {price.usd && <div className="text-xs text-gray-800 px-2">${price.usd} USD</div>}
          </div>

        </div>

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
