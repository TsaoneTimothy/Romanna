import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { Store } from '@/types';
import { StoreCard } from '@/components/store/StoreCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setStores(data || []);
    } catch (error: any) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">QuickShop</h1>
                <p className="text-xs text-gray-500">Groceries at your doorstep</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile && (
                <>
                  <div className="hidden sm:block text-right mr-2">
                    <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                  </div>
                  <Button onClick={() => navigate('/cart')} variant="outline" size="md">
                    <span className="text-xl mr-1">🛒</span> Cart
                  </Button>
                  {profile.role === 'driver' && (
                    <Button onClick={() => navigate('/driver')} variant="outline" size="md">
                      <span className="text-xl mr-1">🚗</span> Dashboard
                    </Button>
                  )}
                  <Button onClick={handleSignOut} variant="secondary" size="md">
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-primary-900 mb-2">Browse Stores</h2>
            <p className="text-gray-600 mb-6">Choose from your favorite local stores</p>
          </div>
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg shadow-sm transition-all bg-white"
            />
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600 text-lg">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏪</div>
            <p className="text-gray-600 text-lg">No stores found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigate(`/store/${store.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
