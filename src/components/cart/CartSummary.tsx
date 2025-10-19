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
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🛒</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 text-lg">Add items from stores to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center">
              {item.product.image_url ? (
                <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">{item.product.name}</h3>
              <p className="text-primary-600 font-semibold text-lg">P{item.product.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="px-4 py-2 text-xl font-bold text-primary-600 hover:bg-primary-50 rounded-l-xl transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 font-bold text-lg min-w-[3rem] text-center text-primary-900">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="px-4 py-2 text-xl font-bold text-primary-600 hover:bg-primary-50 rounded-r-xl transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onRemove(item.product.id)}
                className="text-red-600 hover:text-red-700 p-2 text-xl"
                aria-label="Remove item"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-primary-900 mb-6">Order Summary</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-bold text-gray-900">P{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Delivery Fee:</span>
            <span className="font-semibold text-gray-500">Set at checkout</span>
          </div>
          <div className="border-t-2 border-gray-100 pt-4 flex justify-between text-2xl font-bold">
            <span className="text-primary-900">Total:</span>
            <span className="text-primary-700">P{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <Button onClick={onCheckout} fullWidth size="xl">
          <span className="text-xl mr-2">→</span> Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
