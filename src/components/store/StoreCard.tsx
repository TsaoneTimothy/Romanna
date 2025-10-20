import { Store } from '@/types';
import { Card } from '@/components/ui/Card';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  const getStoreIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('spar')) return '🛒'; // SPAR - grocery store
    if (lowerName.includes('trans')) return '🏪'; // TRANS - cash & carry
    if (lowerName.includes('fours')) return '🛍️'; // Fours - basket of good
    if (lowerName.includes('choppies')) return '🛒'; // Choppies - grocery
    if (lowerName.includes('shoprite')) return '🛒'; // Shoprite - grocery
    if (lowerName.includes('pick n pay')) return '🛒'; // Pick n Pay - grocery
    return '🏪';
  };

  const getGradientColors = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('spar')) return 'from-red-400 to-red-600'; // SPAR red theme
    if (lowerName.includes('trans')) return 'from-blue-400 to-blue-600'; // TRANS blue theme
    if (lowerName.includes('fours')) return 'from-green-400 to-green-600'; // Fours green theme
    if (lowerName.includes('choppies')) return 'from-green-400 to-emerald-500'; // Choppies green theme
    if (lowerName.includes('shoprite')) return 'from-red-400 to-red-500'; // Shoprite red theme
    if (lowerName.includes('pick n pay')) return 'from-blue-400 to-indigo-500'; // Pick n Pay blue theme
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
      className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-gray-200 hover:border-primary-300 overflow-hidden cursor-pointer"
    >
      <div className={`aspect-video bg-gradient-to-br ${getGradientColors(store.name)} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-bold text-gray-800">⭐ 4.5</span>
          </div>
          {store.website_url && (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-xs">🔗</span>
            </div>
          )}
        </div>
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
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-semibold text-gray-800">🚚 15-30 min</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {store.name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-semibold text-gray-700">4.5</span>
          </div>
        </div>
        {store.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {store.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>📍</span>
          <span className="truncate">{store.address}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
              Free Delivery
            </span>
          </div>
          <div className="text-sm font-semibold text-primary-600">
            Order Now →
          </div>
        </div>
      </div>
    </Card>
  );
}
