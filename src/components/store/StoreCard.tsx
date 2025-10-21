import { Store } from '@/types';
import { Card } from '@/components/ui/Card';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  const getStoreLogo = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('spar')) return '/stores/spar.png';
    if (lowerName.includes('trans')) return '/stores/trans.png';
    if (lowerName.includes('fours')) return '/stores/fours.png';
    if (lowerName.includes('choppies')) return '/stores/choppies.png';
    if (lowerName.includes('shoprite')) return '/stores/shoprite.png';
    if (lowerName.includes('pick n pay')) return '/stores/picknpay.png';
    return '/stores/default.png'; // fallback image
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
      {/* Store image section */}
      <div className="aspect-video bg-gray-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>

        {/* Rating + link badges */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-800 shadow">
          </div>
          {store.website_url && (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs shadow">
            </div>
          )}
        </div>

        {/* Store logo */}
        <img
          src={store.logo_url || getStoreLogo(store.name)}
          alt={store.name}
          className="h-24 w-24 object-contain z-10 group-hover:scale-110 transition-transform duration-300"
        />

        {/* Delivery time badge */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-800 shadow">
            🚚 15–30 min
          </div>
        </div>
      </div>

      {/* Text section */}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {store.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <span>⭐</span>
            <span className="text-sm font-semibold text-gray-700">4.5</span>
          </div>
        </div>

        {store.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {store.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <span>📍</span>
          <span className="truncate">{store.address}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
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
