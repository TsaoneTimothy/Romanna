import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();

  const navigationItems = [
    {
      path: '/',
      icon: '🏠',
      activeIcon: '🏡',
      label: 'Home',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      path: '/search',
      icon: '🔍',
      activeIcon: '🔎',
      label: 'Search',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      path: '/cart',
      icon: '🛒',
      activeIcon: '🛍️',
      label: 'Cart',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      badge: items.length > 0 ? items.length : null,
    },
    {
      path: '/orders',
      icon: '📋',
      activeIcon: '📄',
      label: 'Orders',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      path: '/profile',
      icon: '👤',
      activeIcon: '👨‍💼',
      label: 'Profile',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                  active ? `${item.bgColor} ${item.color}` : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl">
                    {active ? item.activeIcon : item.icon}
                  </span>
                  {item.badge && (
                    <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  )}
                </div>
                <span className={`text-xs font-semibold mt-1 ${active ? item.color : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
