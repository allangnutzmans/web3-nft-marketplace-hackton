'use client'
import { useRouter } from "next/navigation";
import NFTMarketplaceCard from "@/components/ui/nft-marketplace-card";
import { api } from "@/lib/trpc";

export default function NFTGrid() {
  const router = useRouter();
  const { data: nftsData } = api.nft.list.useQuery();
  const { data: ethPriceUSd } = api.nft.getEthPriceUsd.useQuery();

  const rareNfts = nftsData || [];

  const handleBuyNow = (nftId: string) => {
    router.push(`/purchase/${nftId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 max-w-2xl mx-auto">
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
  );
}
