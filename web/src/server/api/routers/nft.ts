import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { pinataService } from '@/server/pinata';
import { prisma } from '@/server/prisma';
import { type NFT } from '@/types/nft';
import { PurchaseStatus } from '@prisma/client';
import { getEthPriceInUsd } from '@/lib/utils';

export const nftRouter = createTRPCRouter({
  list: publicProcedure
    .query(async (): Promise<NFT[]> => {
      try {

        const nftItems = await prisma.nFTItem.findMany({
          where: { isActive: true },
          orderBy: { price: 'desc' },
        });
        const nftList = await Promise.all(
          nftItems.map(async (nftItem) => {
            const metadata = await pinataService.fetchMetadata(nftItem.metadataCid);
            if (!metadata) return null;

            return pinataService.mapMetadataToNFT(nftItem, metadata);
          })
        );

        return nftList.filter(Boolean) as NFT[];

      } catch (error) {
        console.error('Error searching NFTs:', error);
        return [];
      }
    }),

  getByCids: publicProcedure
    .input(z.object({ cids: z.array(z.string()) }))
    .query(async ({ input }): Promise<NFT[]> => {
      try {
        const nftItems = await prisma.nFTItem.findMany({
          where: {
            metadataCid: { in: input.cids },
            isActive: true
          },
        });

        const nftList = await Promise.all(
          nftItems.map(async (nftItem) => {
            const metadata = await pinataService.fetchMetadata(nftItem.metadataCid);
            if (!metadata) return null;

            return pinataService.mapMetadataToNFT(nftItem, metadata);
          })
        );

        return nftList.filter(Boolean) as NFT[];
      } catch (error) {
        console.error('Error fetching NFTs by CIDs:', error);
        return [];
      }
    }),

  getEthPriceUsd: publicProcedure
    .query(async () => {
      try {
        const ethPrice = await getEthPriceInUsd();
        return ethPrice;
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        return null;
      }
    }),
});
