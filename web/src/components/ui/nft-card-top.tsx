import NFTCard from "./nft-card";

interface NFTCardProps {
  imageSrc: string;
  altText: string;
  captionText: string;
  ownedBy: string;
  createdBy: string;
  name: string;
  description: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  price?: string;
  isOnSale?: boolean;
}

export default function NFTCardTop({
  imageSrc,
  altText,
  captionText,
  name,
  description,
  rarity = 'common',
  price,
  isOnSale = false
}: NFTCardProps) {
  const rarityConfig = {
    common: {
      bg: 'from-[var(--muted)] to-[var(--muted)]',
      border: 'border-[var(--border)]',
      shadow: 'shadow-[var(--ring)]/20',
      glow: 'from-[var(--muted-foreground)]/10',
      text: 'text-[var(--muted-foreground)]'
    },
    rare: {
      bg: 'from-[var(--accent)] to-[var(--accent)]',
      border: 'border-[var(--ring)]',
      shadow: 'shadow-[var(--ring)]/30',
      glow: 'from-[var(--primary)]/15',
      text: 'text-[var(--primary)]'
    },
    epic: {
      bg: 'from-[var(--secondary)] to-[var(--secondary)]',
      border: 'border-[var(--primary)]',
      shadow: 'shadow-[var(--primary)]/30',
      glow: 'from-[var(--primary)]/15',
      text: 'text-[var(--primary)]'
    },
    legendary: {
      bg: 'from-[var(--primary)] to-[var(--primary)]',
      border: 'border-[var(--primary)]',
      shadow: 'shadow-[var(--primary)]/30',
      glow: 'from-[var(--primary)]/20',
      text: 'text-[var(--primary)]'
    }
  };

  const config = rarityConfig[rarity];

  return (
    <article
      className={`group relative bg-gradient-to-br from-[var(--card)]/90 via-[var(--card)]/70 to-${config.bg} p-4 rounded-3xl shadow-2xl border border-[var(--border)]/70 backdrop-blur-md hover:shadow-2xl hover:shadow-[var(--ring)]/40 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/30 focus:ring-offset-2`}
      role="article"
      aria-label={`NFT ${name} - ${rarity} rarity`}
      tabIndex={0}
    >
      {/* Rarity indicator */}
      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r ${config.bg} border ${config.border} shadow-lg z-20`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
          {rarity}
        </span>
      </div>

      {/* Status badge */}
      {isOnSale && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="relative">
            <div className="w-6 h-6 bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] rounded-full shadow-lg animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] rounded-full animate-ping opacity-75" />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[var(--primary-foreground)]">
              $
            </span>
          </div>
        </div>
      )}

      {/* Decorative elements with animations */}
      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${config.glow} to-[var(--ring)]/5 rounded-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-75`} />
          
      <div className="relative z-10 space-y-4">
        {/* Header section */}
        <header className="flex justify-between items-center p-4 bg-[var(--card)]/50 rounded-2xl backdrop-blur-sm border border-[var(--border)]/60 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3" role="group" aria-label="Owner information">
            <div className="w-3 h-3 bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] rounded-full shadow-sm animate-pulse" />
            <div>
              <p className="text-xs text-[var(--primary)] font-semibold uppercase tracking-wider opacity-80">Unlimited</p>
            </div>
          </div>

          <div className="flex items-center gap-3" role="group" aria-label="Creator information">
            <div className="text-right">
              <p className="text-xs text-[var(--ring)] font-semibold uppercase tracking-wider opacity-80">Picture based</p>
            </div>
            <div className="w-3 h-3 bg-gradient-to-r from-[var(--ring)] to-[var(--primary)] rounded-full shadow-sm animate-pulse" />
          </div>
        </header>

        {/* NFT display section */}
        <section
          className={`relative bg-gradient-to-br from-[var(--secondary)] via-[var(--secondary)] to-[var(--secondary)]/95 rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]/40 group-hover:shadow-2xl transition-all duration-300`}
          aria-label="NFT display"
        >
          {/* Inner glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} via-transparent to-[var(--ring)]/10 rounded-2xl group-hover:opacity-80 transition-opacity duration-300`} />

          <div className="relative z-10">
            <div className="group-hover:scale-[1.02] transition-transform duration-500">
              <NFTCard
                imageSrc={imageSrc}
                altText={altText}
                captionText={captionText}
                containerHeight="370px"
                containerWidth="370px"
                imageHeight="320px"
                imageWidth="320px"
              />
            </div>

            {/* NFT info overlay */}
            <div className='mx-4 px-4 py-4 mb-2 bg-gradient-to-r from-[var(--card)]/70 to-[var(--card)]/40 backdrop-blur-sm rounded-xl border border-[var(--border)]/50 shadow-inner group-hover:shadow-lg transition-all duration-300'>
              <div className="flex items-start justify-between">
                <h3 className='text-[var(--primary)] font-bold text-lg bg-gradient-to-r from-[var(--primary)] via-[var(--ring)] to-[var(--primary)] bg-clip-text text-transparent leading-tight'>
                  {name}
                </h3>
                {price && (
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide font-medium">Price</span>
                    <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)] px-2 py-1 rounded-lg border border-[var(--border)]">
                      {price}
                    </span>
                  </div>
                )}
              </div>
              <p className='text-[var(--foreground)] text-sm leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-300'>
                {description}
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
