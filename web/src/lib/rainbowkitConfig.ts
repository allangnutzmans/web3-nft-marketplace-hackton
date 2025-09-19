'use client';

import { http, createStorage, cookieStorage } from 'wagmi'
import { defineChain } from 'viem'
import { anvil, baseSepolia } from 'wagmi/chains'
import { type Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = '6a6bc9ccada2df8d6c64e6bc29a2abbe';

const supportedChains: Chain[] = [baseSepolia]

const transports: Record<number, ReturnType<typeof http>> = {
  [baseSepolia.id]: http(),
}

if (process.env.NODE_ENV !== 'production') {
  supportedChains.push(anvil)
  transports[anvil.id] = http('http://127.0.0.1:8545')
}


export const rainbowkitConfig = getDefaultConfig({
  appName: 'Pet NFT Marketplace',
  projectId,
  chains: supportedChains as never,
  ssr: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports,
})