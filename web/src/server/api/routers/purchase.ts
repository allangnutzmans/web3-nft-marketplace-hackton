import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { prisma } from '@/server/prisma';
import { PurchaseStatus } from '@prisma/client';

export const purchaseRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        nftItemId: z.string().min(1, 'NFT ID is required'),
        buyerAddress: z.string().min(1, 'Buyer address is required'),
        amount: z.number().positive('Amount must be positive'),
        txHash: z.string().min(1, 'Transaction hash is required'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if NFT exists
        const nftItem = await prisma.nFTItem.findUnique({
          where: { id: input.nftItemId },
        });

        if (!nftItem) {
          throw new Error('NFT not found');
        }

        if (!nftItem.isActive) {
          throw new Error('NFT is not available for purchase');
        }

        // Check if a purchase already exists with the same transaction hash
        const existingPurchase = await prisma.purchase.findFirst({
          where: { txHash: input.txHash },
        });

        if (existingPurchase) {
          throw new Error('Transaction already processed');
        }

        // Create the purchase
        const purchase = await prisma.purchase.create({
          data: {
            nftItemId: input.nftItemId,
            buyerAddress: input.buyerAddress,
            amount: input.amount,
            txHash: input.txHash,
            status: PurchaseStatus.PENDING,
          },
          include: {
            nftItem: true,
          },
        });

        return purchase;
      } catch (error) {
        console.error('Error creating purchase:', error);
        throw error;
      }
    }),

  getByAddress: publicProcedure
    .input(
      z.object({
        buyerAddress: z.string().min(1, 'Buyer address is required'),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        status: z.nativeEnum(PurchaseStatus).optional(),
      })
    )
    .query(async ({ input }) => {
      const { buyerAddress, page, limit, status } = input;
      const offset = (page - 1) * limit;

      const where = {
        buyerAddress,
        ...(status && { status }),
      };

      const [purchases, total] = await Promise.all([
        prisma.purchase.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            nftItem: true,
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

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const purchase = await prisma.purchase.findUnique({
        where: { id: input.id },
        include: {
          nftItem: true,
        },
      });

      return purchase;
    })
});
