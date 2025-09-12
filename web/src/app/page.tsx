'use client'
import Image from "next/image";
import TiltedCard from "@/components/ui/tilted-card";
import NFTMarketplaceCard from "@/components/ui/nft-marketplace-card";
import { api } from "@/lib/trpc";

export default function Home() {
  const { data: nftsData, isLoading } = api.nft.list.useQuery();
  
  const topNft = nftsData?.[0];
  const rareNfts = nftsData || [];

  return (
    <div className="bg-white min-h-full">
      <div className="relative w-full h-full flex items-center justify-center rounded-l-4xl min-h-[calc(100vh-8.5rem)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt="Background"
            fill
            className="object-cover object-center blur-sm"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </div>
        
        {/* Content with higher z-index */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-1 p-4 ps-8">
            <h2 className="text-xl font-semibold mb-4">Top NFT</h2>
            {topNft && (
              <TiltedCard
                imageSrc={topNft.image}
                altText={topNft.name}
                captionText={topNft.name}
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="300px"
                imageWidth="300px"
              />
            )}
          </div>
            <div className="col-span-2 flex flex-col p-4">
                  {/* Título */}
                  <h2 className="text-xl font-semibold mb-4">Rare NFT</h2>
                  
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rareNfts.map((nft) => (
                        <NFTMarketplaceCard
                          key={nft.id}
                          name={nft.name}
                          imageSrc={nft.image}
                          altText={nft.description ?? nft.name}
                          ownedBy={{
                            name: "N/A",
                            avatar: "https://via.placeholder.com/32/000000/ffffff?text=NA"
                          }}
                          createdBy={{
                            name: "N/A",
                            avatar: "https://via.placeholder.com/32/000000/ffffff?text=NA"
                          }}
                          price={{
                            eth: nft.price,
                            usd: ""
                          }}
                          onViewHistory={() => console.log("View history clicked for", nft.id)}
                          onBuyNow={() => console.log("Buy now clicked for", nft.id)}
                        />
                      ))}
                    </div>
                  )}
            </div>
          </div>
      </div>
    </div>
  );
}