'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import NFTMarketplaceCard from "@/components/ui/nft-marketplace-card";
import { api } from "@/lib/trpc";
import { ScrollArea } from "@/components/ui/scroll-area";
import NFTCardTop from "@/components/ui/nft-card-top";

export default function Home() {
  const router = useRouter();
  const { data: nftsData, isLoading } = api.nft.list.useQuery();
  const { data: ethPriceUSd } = api.nft.getEthPriceUsd.useQuery();


  const topNft = nftsData?.[0];
  const rareNfts = nftsData || [];

  const handleBuyNow = (nftId: string) => {
    router.push(`/purchase/${nftId}`);
  };

  return (
    <div className="bg-white h-full overflow-auto">
      <div className="relative w-full h-full flex items-center justify-center rounded-l-4xl min-h-[calc(100vh-9rem)] overflow-hidden">
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-9rem)]">
            {/* Top NFT */}
            <div className="lg:col-span-1">
              <div className="h-full flex flex-col pt-8">
                <h2 className="text-xl font-semibold mb-4">Top NFT</h2>
                <div className="flex-1 flex items-start justify-center lg:justify-start">
                  {topNft && (
                    <NFTCardTop
                      imageSrc={topNft.image}
                      altText={topNft.name}
                      captionText={topNft.name}
                      name={topNft.name}
                      description={topNft.description ?? topNft.name}
                      ownedBy=""
                      createdBy=""
                      rarity="rare"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Rare NFTs */}
            <div className="lg:col-span-2">
              <div className="h-full flex flex-col lg:pt-8">
                <h2 className="text-xl font-semibold mb-4 ms-22">SHOP NFT</h2>
                <div className="flex-1">
                  <ScrollArea className="h-full max-h-[calc(100vh-15rem)] mb-4">
                    {isLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4  max-w-2xl mx-auto">
                        {rareNfts.map((nft) => (
                          <NFTMarketplaceCard
                            key={nft.id}
                            name={nft.name}
                            imageSrc={nft.image}
                            description={nft.description ?? nft.name}
                            altText={nft.description ?? nft.name}
                            ownedBy=""
                            createdBy=""
                            price={{
                              eth: nft.price,
                              usd: ethPriceUSd ? (parseFloat(nft.price) * ethPriceUSd).toFixed(2) : "",
                            }}
                            onViewHistory={() =>
                              console.log("View history clicked for", nft.id)
                            }
                            onBuyNow={() => handleBuyNow(nft.id)}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}