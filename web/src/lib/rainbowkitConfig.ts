'use client';

import { http, createStorage, cookieStorage } from 'wagmi'
import { defineChain } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { type Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

// Define Anvil chain explicitly - TODO FIX IT TO USE rainbowkit
const anvilLocal = defineChain({
  id: 31337,
  name: 'Anvil Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
})

const projectId = '6a6bc9ccada2df8d6c64e6bc29a2abbe';

const supportedChains: Chain[] = [baseSepolia, anvilLocal]

export const rainbowkitConfig = getDefaultConfig({
  appName: 'Pet NFT Marketplace',
  projectId,
  chains: supportedChains as never,
  ssr: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [baseSepolia.id]: http(),
    [anvilLocal.id]: http('http://127.0.0.1:8545')
  },
})