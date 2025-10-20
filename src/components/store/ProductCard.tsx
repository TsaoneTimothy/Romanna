import { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getProductIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pizza')) return '🍕';
    if (lowerName.includes('burger')) return '🍔';
    if (lowerName.includes('sushi') || lowerName.includes('roll')) return '🍣';
    if (lowerName.includes('pasta') || lowerName.includes('noodle')) return '🍝';
    if (lowerName.includes('salad')) return '🥗';
    if (lowerName.includes('sandwich')) return '🥪';
    if (lowerName.includes('taco')) return '🌮';
    if (lowerName.includes('coffee') || lowerName.includes('latte')) return '☕';
    if (lowerName.includes('cake') || lowerName.includes('dessert')) return '🍰';
    if (lowerName.includes('drink') || lowerName.includes('juice')) return '🥤';
    if (lowerName.includes('bread') || lowerName.includes('bagel')) return '🥖';
    if (lowerName.includes('fruit') || lowerName.includes('apple')) return '🍎';
    if (lowerName.includes('vegetable') || lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('meat') || lowerName.includes('chicken')) return '🍗';
    if (lowerName.includes('fish') || lowerName.includes('salmon')) return '🐟';
    return '🍽️';
  };

  const getBackgroundGradient = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pizza')) return 'from-orange-100 to-red-100';
    if (lowerName.includes('burger')) return 'from-yellow-100 to-orange-100';
    if (lowerName.includes('sushi') || lowerName.includes('roll')) return 'from-blue-100 to-purple-100';
    if (lowerName.includes('salad')) return 'from-green-100 to-emerald-100';
    if (lowerName.includes('coffee') || lowerName.includes('latte')) return 'from-amber-100 to-orange-100';
    if (lowerName.includes('cake') || lowerName.includes('dessert')) return 'from-pink-100 to-purple-100';
    if (lowerName.includes('drink') || lowerName.includes('juice')) return 'from-cyan-100 to-blue-100';
    if (lowerName.includes('fruit')) return 'from-green-100 to-yellow-100';
    if (lowerName.includes('vegetable')) return 'from-green-100 to-lime-100';
    if (lowerName.includes('meat') || lowerName.includes('chicken')) return 'from-red-100 to-orange-100';
    if (lowerName.includes('fish') || lowerName.includes('salmon')) return 'from-blue-100 to-cyan-100';
    return 'from-gray-100 to-gray-200';
  };

  const isAvailable = product.is_available && product.stock_quantity > 0;

  return (
    <Card className="flex flex-col h-full group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-gray-200 hover:border-primary-300 overflow-hidden">
      <div className={`aspect-square bg-gradient-to-br ${getBackgroundGradient(product.name)} flex items-center justify-center relative overflow-hidden`}>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
            {getProductIcon(product.name)}
          </div>
        )}
        
        {/* Stock indicator */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-full px-4 py-2">
              <span className="text-sm font-bold text-gray-800">Out of Stock</span>
            </div>
          </div>
        )}

        {/* Favorite button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <span className="text-lg">🤍</span>
        </button>

        {/* Discount badge */}
        {Math.random() > 0.7 && (
          <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -20%
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-sm font-semibold text-gray-700">4.2</span>
          </div>
        </div>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-xs text-gray-500 block font-medium">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary-600">₱{product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 font-medium">per {product.unit}</span>
              </div>
            </div>
            {product.stock_quantity > 0 && (
              <div className="text-right">
                <span className="text-xs text-gray-500 block font-medium">Stock</span>
                <span className="text-sm font-semibold text-secondary-600">
                  {product.stock_quantity} left
                </span>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!isAvailable}
            className={`w-full ${
              isAvailable 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            size="lg"
          >
            {isAvailable ? (
              <div className="flex items-center justify-center gap-2">
                <span>🛒</span>
                <span>Add to Cart</span>
              </div>
            ) : (
              'Out of Stock'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
