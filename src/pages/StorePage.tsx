import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { Store, Product, Category } from '@/types';
import { ProductCard } from '@/components/store/ProductCard';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export function StorePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      const [storeResult, productsResult, categoriesResult] = await Promise.all([
        supabase.from('stores').select('*').eq('id', storeId).maybeSingle(),
        supabase.from('products').select('*').eq('store_id', storeId).eq('is_available', true),
        supabase.from('categories').select('*').order('sort_order'),
      ]);

      if (storeResult.error) throw storeResult.error;
      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setStore(storeResult.data);
      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error: any) {
      console.error('Error fetching store data:', error);
      toast.error('Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 text-lg">Store not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/')} variant="outline" size="md">
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-primary-900">{store.name}</h1>
            </div>
            <Button onClick={() => navigate('/cart')} size="lg">
              🛒 Cart {itemCount > 0 && `(${itemCount})`}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'primary' : 'outline'}
                size="lg"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="lg"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Products {selectedCategory && `- ${categories.find((c) => c.id === selectedCategory)?.name}`}
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
