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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/')} variant="outline" size="md">
                ← Continue Shopping
              </Button>
              <h1 className="text-2xl font-bold text-primary-900">Shopping Cart</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
