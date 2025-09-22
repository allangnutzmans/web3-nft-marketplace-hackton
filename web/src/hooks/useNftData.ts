import { useMemo } from 'react';
import { api } from '@/lib/trpc';
import { type NFT } from '@/types/nft';

interface PurchaseWithNftItem {
  nftItem: {
    metadataCid: string;
  };
}

export function useNftData<T extends PurchaseWithNftItem>(items: T[] | undefined) {
  // Get unique CIDs to fetch NFT data
  const uniqueCids = useMemo(() => {
    if (!items) return [];
    return [...new Set(items.map(item => item.nftItem.metadataCid))];
  }, [items]);

  // Fetch NFT data for all unique CIDs
  const { data: nftDataList } = api.nft.getByCids.useQuery(
    { cids: uniqueCids },
    { enabled: uniqueCids.length > 0 }
  );

  // Create a map of CID to NFT data
  const nftDataMap = useMemo(() => {
    const map = new Map<string, NFT | null>();
    if (nftDataList) {
      nftDataList.forEach((nft) => {
        map.set(nft.cid, nft);
      });
    }
    return map;
  }, [nftDataList]);

  return { nftDataMap, isLoading: false };
}
