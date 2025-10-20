import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'driver'>('customer');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, role);
        toast.success('Account created successfully!');
      } else {
        await signIn(email, password);
        toast.success('Signed in successfully!');
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200 rounded-full opacity-20 float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent-200 rounded-full opacity-20 float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-secondary-200 rounded-full opacity-20 float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-4 pulse-glow">
              <span className="text-4xl">🍕</span>
            </div>
            <h1 className="text-4xl font-black gradient-text mb-2">Bite</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 font-medium">
              {isSignUp ? 'Join the food delivery revolution' : 'Sign in to continue your food journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 text-lg bg-gray-50 focus:bg-white transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">👤</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      role === 'customer' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={(e) => setRole(e.target.value as 'customer')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-1">🛒</div>
                        <span className="font-semibold">Customer</span>
                      </div>
                    </label>
                    <label className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      role === 'driver' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="driver"
                        checked={role === 'driver'}
                        onChange={(e) => setRole(e.target.value as 'driver')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-1">🚗</div>
                        <span className="font-semibold">Driver</span>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 pl-14 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 text-lg bg-gray-50 focus:bg-white transition-all duration-300"
                  placeholder="Enter your email"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">📧</span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-6 py-4 pl-14 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 text-lg bg-gray-50 focus:bg-white transition-all duration-300"
                  placeholder="Enter your password"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>{isSignUp ? '🚀' : '🔑'}</span>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-bold text-lg transition-colors duration-300"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Social Login Options */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 mb-4">Continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-colors duration-300">
                <span className="text-xl">🔍</span>
                <span className="font-semibold text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-colors duration-300">
                <span className="text-xl">📘</span>
                <span className="font-semibold text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
