import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';

export function Cart() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/')} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105"
                size="md"
              >
                <span className="mr-2">←</span> Continue Shopping
              </Button>
              <div className="border-l-2 border-gray-200 pl-4">
                <h1 className="text-3xl font-black gradient-text">Your Cart</h1>
                <p className="text-sm text-gray-600 font-medium">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-full border-2 border-white shadow-lg">
                <span className="text-sm font-bold">Total: ₱{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      {items.length > 0 && (
        <div className="bg-gradient-to-r from-secondary-500 via-secondary-600 to-accent-500 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl">🎉</span>
              <div className="text-center">
                <p className="text-lg font-bold">Free delivery on orders over ₱500!</p>
                <p className="text-sm opacity-90">
                  {subtotal < 500 ? `Add ₱${(500 - subtotal).toFixed(2)} more for free delivery` : 'You qualify for free delivery!'}
                </p>
              </div>
              <span className="text-2xl">🚚</span>
            </div>
          </div>
        </div>
      )}

      <main className="container section pb-24">
        <CartSummary
          items={items}
          subtotal={subtotal}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onCheckout={handleCheckout}
        />
      </main>
    </div>
  );
}
