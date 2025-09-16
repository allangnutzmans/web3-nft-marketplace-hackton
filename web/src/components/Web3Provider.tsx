"use client";

import { WagmiProvider, cookieToInitialState } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';
import { rainbowkitConfig } from "@/lib/rainbowkitConfig";
import { getRainbowKitTheme } from "@/config/rainbowkitTheme";

type Props = {
    children: React.ReactNode;
    cookie?: string | null;
};

const theme = getRainbowKitTheme();

export default function Web3Provider({ children, cookie }: Props) {
    const initialState = cookieToInitialState(rainbowkitConfig, cookie);
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={rainbowkitConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={theme}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
