import { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export function CartSummary({
  items,
  subtotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSummaryProps) {
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="content-area text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8 float border-4 border-white shadow-lg">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 text-xl mb-8">Add delicious items from our stores to get started</p>
        <div className="flex justify-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-3xl">🍕</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-3xl">🍔</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-3xl">🍣</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="content-area">
          <div className="content-area-header">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Cart Items</h3>
              <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold border border-primary-200">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          </div>
        
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.product.image_url ? (
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  ) : (
                    <span className="text-4xl">🍽️</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-primary-600 transition-colors">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.product.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-primary-600">₱{item.product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">per {item.product.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-2xl shadow-sm">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-10 h-10 text-xl font-bold text-primary-600 hover:bg-primary-100 rounded-l-2xl transition-colors flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-bold text-lg min-w-[3rem] text-center text-primary-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-10 h-10 text-xl font-bold text-primary-600 hover:bg-primary-100 rounded-r-2xl transition-colors flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ₱{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="content-area-elevated sticky top-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📋</span>
            Order Summary
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-bold text-gray-900">₱{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className={`font-semibold ${deliveryFee === 0 ? 'text-secondary-600' : 'text-gray-900'}`}>
                {deliveryFee === 0 ? 'FREE!' : `₱${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            
            {subtotal < 500 && (
              <div className="bg-accent-100 border border-accent-200 rounded-2xl p-3">
                <p className="text-sm text-accent-800 font-medium">
                  Add ₱{(500 - subtotal).toFixed(2)} more for free delivery!
                </p>
              </div>
            )}
            
            <div className="border-t-2 border-gray-100 pt-4">
              <div className="flex justify-between text-2xl font-black">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary-600">₱{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onCheckout} 
            fullWidth 
            size="xl"
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>Proceed to Checkout</span>
            </div>
          </Button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure checkout with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
