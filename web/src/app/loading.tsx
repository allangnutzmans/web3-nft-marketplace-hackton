import { Skeleton } from "@/components/ui/skeleton";
import NFTCardSkeleton from "@/components/ui/nft-card-skeleton";
import NFTCardTopSkeleton from "@/components/ui/nft-card-top-skeleton";

export default function Loading() {
  return (
    <div className="bg-white h-full overflow-auto">
      <div className="relative w-full h-full flex items-center justify-center rounded-l-4xl min-h-[calc(100vh-9rem)] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gray-100 animate-pulse" />

        {/* Content with higher z-index */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-9rem)]">
            {/* Top NFT Skeleton */}
            <div className="lg:col-span-1">
              <div className="h-full flex flex-col pt-8">
                <Skeleton className="h-6 w-20 mb-4" />
                <div className="flex-1 flex items-start justify-center lg:justify-start">
                  <NFTCardTopSkeleton />
                </div>
              </div>
            </div>

            {/* Rare NFTs Skeleton */}
            <div className="lg:col-span-2">
              <div className="h-full flex flex-col lg:pt-8">
                <Skeleton className="h-6 w-24 mb-4 ms-22" />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 max-w-2xl mx-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <NFTCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
