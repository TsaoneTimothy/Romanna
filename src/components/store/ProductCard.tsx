import { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full group">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-gray-400 text-6xl">📦</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-sm text-gray-500 block">Price</span>
              <span className="text-2xl font-bold text-primary-700">P{product.price.toFixed(2)}</span>
            </div>
            <span className="text-sm text-gray-500">per {product.unit}</span>
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.is_available || product.stock_quantity === 0}
            fullWidth
            size="md"
          >
            {product.is_available && product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
