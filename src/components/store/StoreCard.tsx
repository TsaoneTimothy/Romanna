import { Store } from '@/types';
import { Card } from '@/components/ui/Card';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <Card onClick={onClick}>
      <div className="aspect-video bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        {store.logo_url ? (
          <img src={store.logo_url} alt={store.name} className="h-24 object-contain" />
        ) : (
          <span className="text-5xl font-bold text-white z-10">{store.name[0]}</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-primary-900 mb-1">{store.name}</h3>
        {store.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{store.description}</p>
        )}
        <p className="text-gray-500 text-sm">{store.address}</p>
      </div>
    </Card>
  );
}
