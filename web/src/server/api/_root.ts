import { createTRPCRouter } from '@/server/trpc';
import { nftRouter } from './routers/nft';
export const appRouter = createTRPCRouter({
    nft: nftRouter,
});
export type AppRouter = typeof appRouter;