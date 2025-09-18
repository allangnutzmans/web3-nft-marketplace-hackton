"use client";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api, client } from "@/lib/trpc";
import dynamic from "next/dynamic";

const Web3Provider = dynamic(() => import("@/components/Web3Provider"), {
    ssr: false,
});

type Props = {
    children: React.ReactNode;
    cookie?: string | null;
}

export default function Providers({ children,  cookie }: Props) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={client} queryClient={queryClient}>
                <Web3Provider cookie={cookie}>
                    {children}
                </Web3Provider>
            </api.Provider>
        </QueryClientProvider>
    );
}