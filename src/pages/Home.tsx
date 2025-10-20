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

  const categories = [
    { name: 'All Stores', icon: '🏪', color: 'bg-primary-500' },
    { name: 'Groceries', icon: '🛒', color: 'bg-green-500' },
    { name: 'Fresh Produce', icon: '🥬', color: 'bg-green-400' },
    { name: 'Promotions', icon: '🏷️', color: 'bg-orange-500' },
    { name: 'Household', icon: '🧽', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg pulse-glow border-2 border-white">
                <span className="text-3xl">🍕</span>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <h1 className="text-3xl font-black gradient-text">RomaNna</h1>
                <p className="text-sm text-gray-600 font-medium">Botswana Store Directory</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile && (
                <>
                  <div className="hidden sm:block text-right mr-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-bold text-gray-900">{profile.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize font-medium">{profile.role}</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/cart')} 
                    className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                    size="md"
                  >
                    <span className="text-xl mr-2">🛒</span> Cart
                  </Button>
                  {profile.role === 'driver' && (
                    <Button 
                      onClick={() => navigate('/driver')} 
                      className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                      size="md"
                    >
                      <span className="text-xl mr-2">🚗</span> Dashboard
                    </Button>
                  )}
                  <Button 
                    onClick={handleSignOut} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300 shadow-md hover:shadow-lg"
                    size="md"
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white py-8 border-b-2 border-primary-600">
        <div className="container">
          <div className="content-area bg-white/10 border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-black mb-2">Botswana Stores</h2>
                <p className="text-xl font-semibold mb-1">Find Your Local Deals!</p>
                <p className="text-primary-100">Browse promotions from SPAR, TRANS, Fours, Choppies, Shoprite & Pick n Pay</p>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center float border-2 border-white/30">
                  <span className="text-6xl">🛒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container section pb-24">
        {/* Search Section */}
        <div className="content-area mb-8">
          <div className="content-area-header">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Local Stores</h2>
            <p className="text-gray-600">Search from Botswana's leading grocery stores and supermarkets</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for SPAR, TRANS, Fours, Choppies, Shoprite, Pick n Pay..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-16 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 text-lg shadow-lg transition-all bg-white hover:shadow-xl"
            />
            <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button 
                className="bg-primary-500 hover:bg-primary-600 text-white border-0 rounded-full w-10 h-10 p-0"
                size="sm"
              >
                →
              </Button>
            </div>
          </div>
        </div>

        {/* Category Icons */}
        <div className="content-area mb-8">
          <div className="content-area-header">
            <h3 className="text-2xl font-bold text-gray-900">Browse Categories</h3>
            <p className="text-gray-600">Find what you need from our store categories</p>
          </div>
          <div className="flex justify-center gap-6 overflow-x-auto pb-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex flex-col items-center gap-3 cursor-pointer group min-w-[80px] p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300 border-2 border-white`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stores Section */}
        <div className="content-area">
          <div className="content-area-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Botswana Stores</h3>
                <p className="text-gray-600">Click on any store to visit their promotions and special offers</p>
              </div>
              <Button 
                className="text-primary-600 hover:text-primary-700 bg-transparent border-2 border-primary-200 hover:border-primary-300 p-3 font-semibold"
                size="md"
              >
                See all →
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading amazing stores...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-200">
                <span className="text-5xl">🏪</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">No stores found</h4>
              <p className="text-gray-600 text-lg">Try adjusting your search or browse our categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => {}} // Empty function since we handle clicks in StoreCard
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
