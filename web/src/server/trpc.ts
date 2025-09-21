import { initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@next/server';
import superjson from 'superjson';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
