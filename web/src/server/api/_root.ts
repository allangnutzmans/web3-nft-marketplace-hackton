import { createTRPCRouter } from '@/server/trpc';
import { nftRouter } from './routers/nft';
import { purchaseRouter } from './routers/purchase';

export const appRouter = createTRPCRouter({
    nft: nftRouter,
    purchase: purchaseRouter,
});
export type AppRouter = typeof appRouter;