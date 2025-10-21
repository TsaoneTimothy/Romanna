import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';
import { Profile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // For mock data, create a default profile
      const mockProfile: Profile = {
        id: userId,
        email: 'demo@bite.com',
        full_name: 'Demo User',
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, _password: string, fullName: string, role: 'customer' | 'driver' = 'customer') => {
    // For mock data, simulate successful signup
    const mockUser = { id: 'mock-user-' + Date.now(), email };
    const mockProfile: Profile = {
      id: mockUser.id,
      email,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser as any);
    setProfile(mockProfile);
    
    return { data: { user: mockUser }, error: null };
  };

  const signIn = async (email: string, _password: string) => {
    // For mock data, simulate successful signin
    const mockUser = { id: 'mock-user', email };
    const mockProfile: Profile = {
      id: mockUser.id,
      email,
      full_name: 'Demo User',
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser as any);
    setProfile(mockProfile);
    
    return { data: { user: mockUser }, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
