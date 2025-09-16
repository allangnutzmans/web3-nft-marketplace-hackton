"use client";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { api, client } from "@/lib/trpc";
import dynamic from "next/dynamic";
import type { Session } from 'next-auth';

const Web3Provider = dynamic(() => import("@/components/Web3Provider"), {
    ssr: false,
});

type Props = {
    children: React.ReactNode;
    cookie?: string | null;
    session: Session | null
};

export default function Providers({ children , cookie, session }: Props) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={client} queryClient={queryClient}>
                <Web3Provider cookie={cookie}>
                    <SessionProvider session={session}>
                        {children}
                    </SessionProvider>
                </Web3Provider>
            </api.Provider>
        </QueryClientProvider>
    );
}