import { Store } from '@/types';
import { Card } from '@/components/ui/Card';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  const getStoreIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('spar')) return '🛒';
    if (lowerName.includes('trans')) return '🏪';
    if (lowerName.includes('fours')) return '🛍️';
    if (lowerName.includes('choppies')) return '🛒';
    if (lowerName.includes('shoprite')) return '🛒';
    if (lowerName.includes('pick n pay')) return '🛒';
    return '🏪';
  };

  const getGradientColors = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('spar')) return 'from-red-400 to-red-600';
    if (lowerName.includes('trans')) return 'from-blue-400 to-blue-600';
    if (lowerName.includes('fours')) return 'from-green-400 to-green-600';
    if (lowerName.includes('choppies')) return 'from-green-400 to-emerald-500';
    if (lowerName.includes('shoprite')) return 'from-red-400 to-red-500';
    if (lowerName.includes('pick n pay')) return 'from-blue-400 to-indigo-500';
    return 'from-primary-400 to-primary-600';
  };

  const handleStoreClick = () => {
    if (store.website_url) {
      window.open(store.website_url, '_blank', 'noopener,noreferrer');
    } else {
      onClick();
    }
  };

  return (
    <Card
      onClick={handleStoreClick}
      className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-200 hover:border-primary-300 overflow-hidden cursor-pointer rounded-xl"
    >
      {/* 🏪 Image / Logo Container */}
      <div
        className={`aspect-video bg-gradient-to-br ${getGradientColors(
          store.name
        )} flex items-center justify-center relative overflow-hidden p-4`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>

        {/* Top-right rating badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-bold text-gray-800">⭐ 4.5</span>
          </div>
          {store.website_url && (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-xs">🔗</span>
            </div>
          )}
        </div>

        {/* Logo or fallback icon */}
        {store.logo_url ? (
          <img
            src={store.logo_url}
            alt={store.name}
            className="h-20 w-20 object-contain z-10 group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl z-10 group-hover:scale-110 transition-transform duration-300">
            {getStoreIcon(store.name)}
          </div>
        )}

        {/* Delivery tag */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-semibold text-gray-800">
              🚚 15–30 min
            </span>
          </div>
        </div>
      </div>

      {/* 🧾 Text Content */}
      <div className="px-6 py-5">
        {/* Store name & rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
            {store.name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-sm font-medium text-gray-700">4.5</span>
          </div>
        </div>

        {/* Store description */}
        {store.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {store.description}
          </p>
        )}

        {/* Address */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <span>📍</span>
          <span className="truncate">{store.address}</span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full">
            Free Delivery
          </span>
          <span className="text-sm font-semibold text-primary-600">
            Order Now →
          </span>
        </div>
      </div>
    </Card>
  );
}
