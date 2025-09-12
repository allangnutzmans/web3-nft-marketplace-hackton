import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { pinataService } from '@/server/pinata';
import { prisma } from '@/server/prisma';
import { NFT } from '@/types/nft';
import { PurchaseStatus } from '@prisma/client';

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

  getByCid: publicProcedure
    .input(z.object({ cid: z.string() }))
    .query(async ({ input }): Promise<NFT | null> => {
      try {
        const nftItem = await prisma.nFTItem.findUnique({
          where: { metadataCid: input.cid },
        });

        if (!nftItem) return null;

        const metadata = await pinataService.fetchMetadata(input.cid);
        if (!metadata) return null;

        return pinataService.mapMetadataToNFT(nftItem, metadata);
      } catch (error) {
        console.error('Error fetching NFT by CID:', error);
        return null;
      }
    }),

  addNFT: publicProcedure
    .input(
      z.object({
        metadataCid: z.string().min(1, 'CID dos metadados é obrigatório'),
        price: z.number().positive('Preço deve ser positivo'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const existingNft = await prisma.nFTItem.findUnique({
          where: { metadataCid: input.metadataCid },
        });

        if (existingNft) {
          throw new Error('NFT com este CID já existe');
        }

        const metadata = await pinataService.fetchMetadata(input.metadataCid);
        if (!metadata) {
          throw new Error('Metadados não encontrados no Pinata');
        }

        return prisma.nFTItem.create({
          data: {
            metadataCid: input.metadataCid,
            price: input.price,
          },
        });
      } catch (error) {
        console.error('Error adding NFT:', error);
        throw error;
      }
    }),
  // Listar compras de um NFT
  getPurchases: publicProcedure
    .input(
      z.object({
        nftId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        status: z.nativeEnum(PurchaseStatus).optional(),
      })
    )
    .query(async ({ input }) => {
      const { nftId, page, limit, status } = input;
      const offset = (page - 1) * limit;

      const where = {
        nftItemId: nftId,
        ...(status && { status }),
      };

      const [purchases, total] = await Promise.all([
        prisma.purchase.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            nftItem: {
              select: { name: true },
            },
          },
        }),
        prisma.purchase.count({ where }),
      ]);

      return {
        purchases,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});
