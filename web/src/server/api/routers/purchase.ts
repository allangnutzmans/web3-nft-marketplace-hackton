import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { prisma } from '@/server/prisma';
import { PurchaseStatus } from '@prisma/client';
import { ContractService } from '@/server/contract-service';

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
    }),

  // PASS THE BELOW TO A ADMIN ROUTE
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(PurchaseStatus),
        tokenId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const purchase = await prisma.purchase.update({
          where: { id: input.id },
          data: {
            status: input.status,
            ...(input.tokenId && { tokenId: input.tokenId }),
            updatedAt: new Date(),
          },
          include: {
            nftItem: true,
          },
        });

        return purchase;
      } catch (error) {
        console.error('Error updating purchase status:', error);
        throw error;
      }
    }),

  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        status: z.nativeEnum(PurchaseStatus).optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      const where = {
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

  // Approve purchase (mint NFT automatically)
  approvePurchase: publicProcedure
    .input(z.object({ purchaseId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const purchase = await prisma.purchase.findUnique({
          where: { id: input.purchaseId },
          include: { nftItem: true },
        });

        if (!purchase) {
          throw new Error('Purchase not found');
        }

        if (purchase.status !== PurchaseStatus.PENDING) {
          throw new Error('Purchase has already been processed');
        }

        // Mint on contract
        const metadataUri = `https://ipfs.io/ipfs/${purchase.nftItem.metadataCid}`;
        const contractResult = await ContractService.approvePurchase(
          purchase.buyerAddress,
          metadataUri
        );

        // Update status in database with transaction info
        const updatedPurchase = await prisma.purchase.update({
          where: { id: input.purchaseId },
          data: {
            status: PurchaseStatus.APPROVED,
            tokenId: contractResult.tokenId,
            mintTxHash: contractResult.txHash,
            updatedAt: new Date(),
          },
          include: { nftItem: true },
        });

        return {
          success: true,
          purchase: updatedPurchase,
          message: `✅ NFT minted successfully! Token ID: ${contractResult.tokenId}`,
          contractResult,
        };
      } catch (error) {
        console.error('Error approving purchase:', error);

        // If error occurred, keep as pending to retry later
        await prisma.purchase.update({
          where: { id: input.purchaseId },
          data: { updatedAt: new Date() }
        });

        throw error;
      }
    }),

  // Reject purchase (automatic refund)
  rejectPurchase: publicProcedure
    .input(z.object({ purchaseId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const purchase = await prisma.purchase.findUnique({
          where: { id: input.purchaseId },
        });

        if (!purchase) {
          throw new Error('Purchase not found');
        }

        if (purchase.status !== PurchaseStatus.PENDING) {
          throw new Error('Purchase has already been processed');
        }

        // Refund on contract
        const contractResult = await ContractService.rejectPurchase(
          purchase.buyerAddress,
          purchase.amount.toString()
        );

        // Update status in database with transaction info
        const updatedPurchase = await prisma.purchase.update({
          where: { id: input.purchaseId },
          data: {
            status: PurchaseStatus.REJECTED,
            refundTxHash: contractResult.txHash,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          purchase: updatedPurchase,
          message: `💰 Refund processed successfully! ${purchase.amount.toString()} ETH returned.`,
          contractResult,
        };
      } catch (error) {
        console.error('Error rejecting purchase:', error);

        // If error occurred, keep as pending to retry later
        await prisma.purchase.update({
          where: { id: input.purchaseId },
          data: { updatedAt: new Date() }
        });

        throw error;
      }
    }),

  // List pending purchases for admin
  getPendingPurchases: publicProcedure
    .query(async () => {
      try {
        const purchases = await prisma.purchase.findMany({
          where: { status: PurchaseStatus.PENDING },
          orderBy: { createdAt: 'desc' },
          include: {
            nftItem: true,
          },
        });

        return purchases;
      } catch (error) {
        console.error('Error fetching pending purchases:', error);
        return [];
      }
    }),
});
