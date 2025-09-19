import { getCssVar } from '@/lib/helpers';
import { type Theme } from '@rainbow-me/rainbowkit';

export function getRainbowKitTheme(): Theme {
    return {
        blurs: {
            modalOverlay: 'blur(8px)',
        },
        colors: {
            accentColor: getCssVar('--primary'),
            accentColorForeground: getCssVar('--primary-foreground'),
            actionButtonBorder: getCssVar('--border'),
            actionButtonBorderMobile: getCssVar('--border'),
            actionButtonSecondaryBackground: getCssVar('--popover'),
            closeButton: getCssVar('--foreground'),
            closeButtonBackground: getCssVar('--input'),
            connectButtonBackground: getCssVar('--card'),
            connectButtonBackgroundError: getCssVar('--destructive'),
            connectButtonInnerBackground: getCssVar('--card'),
            connectButtonText: getCssVar('--foreground'),
            connectButtonTextError: getCssVar('--destructive-foreground'),
            connectionIndicator: getCssVar('--ring'),
            downloadBottomCardBackground: getCssVar('--card'),
            downloadTopCardBackground: getCssVar('--popover'),
            error: getCssVar('--destructive'),
            generalBorder: getCssVar('--border'),
            generalBorderDim: getCssVar('--border'),
            menuItemBackground: getCssVar('--popover'),
            modalBackdrop: 'rgba(0, 0, 0, 0.6)',
            modalBackground: getCssVar('--card'),
            modalBorder: getCssVar('--border'),
            modalText: getCssVar('--foreground'),
            modalTextDim: getCssVar('--muted-foreground'),
            modalTextSecondary: getCssVar('--muted-foreground'), // ✅ fix
            profileAction: getCssVar('--accent'),
            profileActionHover: getCssVar('--primary'),
            profileForeground: getCssVar('--foreground'),
            selectedOptionBorder: getCssVar('--ring'),
            standby: getCssVar('--accent'),
        },
        fonts: {
            body: 'Inter, sans-serif',
        },
        radii: {
            actionButton: '12px',
            connectButton: '12px',
            menuButton: '12px',
            modal: '16px',
            modalMobile: '16px',
        },
        shadows: {
            connectButton: `0 0 0 1px ${getCssVar('--primary')}`,
            dialog: '0 10px 40px rgba(0,0,0,0.6)',
            profileDetailsAction: `0 0 0 1px ${getCssVar('--accent')}`,
            selectedOption: `0 0 0 1px ${getCssVar('--ring')}`,
            selectedWallet: `0 0 0 2px ${getCssVar('--ring')}`,
            walletLogo: `0 0 0 1px ${getCssVar('--border')}`,
        },
    };
}
