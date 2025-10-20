import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { VoiceAssistant } from '@/components/voice/VoiceAssistant';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { Home } from '@/pages/Home';
import { StorePage } from '@/pages/StorePage';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Tracking } from '@/pages/Tracking';
import { voiceService } from '@/services/voiceService';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}

function AppContent() {
  const navigate = useNavigate();

  const handleVoiceCommand = async (_command: string, action: string, params?: any) => {
    switch (action) {
      case 'navigate':
        if (params?.destination) {
          navigate(`/${params.destination}`);
          await voiceService.speak(`Navigating to ${params.destination}`);
        }
        break;

      case 'search':
        if (params?.query) {
          navigate('/');
          await voiceService.speak(`Searching for ${params.query}`);
        }
        break;

      case 'checkout':
        navigate('/checkout');
        await voiceService.speak('Going to checkout');
        break;

      case 'add_to_cart':
        if (params?.items && params.items.length > 0) {
          await voiceService.speak(`Looking for ${params.items.join(' and ')}`);
        }
        break;
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:storeId"
          element={
            <ProtectedRoute>
              <StorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking/:orderId"
          element={
            <ProtectedRoute>
              <Tracking />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <BottomNavigation />
      <VoiceAssistant onCommand={handleVoiceCommand} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '18px',
            padding: '16px',
            background: 'white',
            color: '#1f2937',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
