"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { anvil, baseSepolia } from 'wagmi/chains';
import { Button } from './ui/button';

const isProd = process.env.NODE_ENV === 'production';

export default function NetworkSwitcher() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                const allowedChains =
                    isProd
                        ? [baseSepolia.id]
                        : [baseSepolia.id, anvil.id];

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Connect Wallet
                                    </Button>
                                );
                            }

                            if (!allowedChains.includes(chain.id)) {
                                return (
                                    <Button
                                        onClick={openChainModal}
                                        type="button"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Wrong network
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    onClick={openChainModal}
                                    variant="ghost"
                                    disabled={isProd}
                                >
                                    {chain?.hasIcon && chain.iconUrl && (
                                        <img
                                            alt={chain.name ?? 'Chain icon'}
                                            src={chain.iconUrl}
                                            style={{ width: 20, height: 20 }}
                                        />
                                    )}
                                    {chain?.name} Connected
                                </Button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
