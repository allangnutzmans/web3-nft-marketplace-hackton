"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';

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
                                    <button 
                                        onClick={openConnectModal} 
                                        type="button"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button 
                                        onClick={openChainModal} 
                                        type="button"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <button
                                    onClick={openChainModal}
                                    type="button"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                                >
                                    {chain.hasIcon && (
                                        <div
                                            style={{
                                                background: chain.iconBackground,
                                                width: 12,
                                                height: 12,
                                                borderRadius: 999,
                                                overflow: 'hidden',
                                                marginRight: 4,
                                            }}
                                        >
                                            {chain.iconUrl && (
                                                <img
                                                    alt={chain.name ?? 'Chain icon'}
                                                    src={chain.iconUrl}
                                                    style={{ width: 12, height: 12 }}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {chain.name} ↓
                                </button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
