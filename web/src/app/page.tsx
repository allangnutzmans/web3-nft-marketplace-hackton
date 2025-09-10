'use client'
import Image from "next/image";
import TiltedCard from "@/components/ui/tilted-card";
import NFTCard from "@/components/ui/nft-card";
import NFTMarketplaceCard from "@/components/ui/nft-marketplace-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="bg-white min-h-full">
      <div className="relative w-full h-full flex items-center justify-center border-2 border-gray-300 rounded-l-4xl min-h-[calc(100vh-8.5rem)] overflow-hidden">
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
          </div>
            <div className="col-span-2 flex flex-col p-4">
                  {/* Título */}
                  <h2 className="text-xl font-semibold mb-4">Rare NFT</h2>

                  {/* Primeiros 2 cards fixos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <NFTMarketplaceCard
                        name="Kendrick Lamar - GNX"
                        imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                        altText="NFT Artwork"
                        ownedBy={{
                          name: "5811EX",
                          avatar: "https://via.placeholder.com/32/00ff00/ffffff?text=5E"
                        }}
                        createdBy={{
                          name: "45TY87",
                          avatar: "https://via.placeholder.com/32/ff6600/ffffff?text=4T"
                        }}
                        price={{
                          eth: "5.65",
                          usd: "$10,344"
                        }}
                        onViewHistory={() => console.log("View history clicked")}
                        onBuyNow={() => console.log("Buy now clicked")}
                      />
                    </div>

                  {/* Scroll para os 2 últimos cards */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
                      <TiltedCard className="h-60 flex items-center justify-center">
                        <div>Card 3</div>
                      </TiltedCard>
                      <TiltedCard className="h-60 flex items-center justify-center">
                        <div>Card 4</div>
                      </TiltedCard>
                    </div>
                </div>
              </div>
          </div>
    </div>
  );
}

{/* <div className="mt-8">
            <TiltedCard
              imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
              altText="Kendrick Lamar - GNX Album Cover"
              captionText="Kendrick Lamar - GNX"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="tilted-card-demo-text">
                  Kendrick Lamar - GNX
                </p>
              }
            /> */}