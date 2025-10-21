import { mockStores, mockProducts } from '@/data/mockData';

// Mock Supabase client for development
export const mockSupabase = {
  from: (table: string) => ({
    select: (_columns: string = '*') => ({
      eq: (eqColumn: string, value: any) => ({
        order: (_orderColumn: string) => Promise.resolve({
          data: table === 'stores'
            ? mockStores.filter(store => eqColumn === 'is_active' ? store.is_active === value : true)
            : table === 'products'
            ? mockProducts.filter(product => eqColumn === 'store_id' ? product.store_id === value : true)
            : [],
          error: null
        })
      })
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null }),
    signUp: () => Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simulate immediate authentication for demo
      setTimeout(() => {
        callback('SIGNED_IN', { user: { id: 'mock-user', email: 'demo@bite.com' } });
      }, 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};
