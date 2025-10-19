import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Order, OrderItem, DriverLocation, Store } from '@/types';
import { DeliveryMap } from '@/components/map/DeliveryMap';
import { ChatBox } from '@/components/chat/ChatBox';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function Tracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  useEffect(() => {
    if (!order?.driver_id) return;

    const subscription = supabase
      .channel(`driver_location:${order.driver_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${order.driver_id}`,
        },
        (payload) => {
          setDriverLocation(payload.new as DriverLocation);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [order?.driver_id]);

  useEffect(() => {
    if (!orderId) return;

    const subscription = supabase
      .channel(`orders:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!orderData) {
        toast.error('Order not found');
        navigate('/');
        return;
      }

      setOrder(orderData);

      const [itemsResult, storeResult] = await Promise.all([
        supabase
          .from('order_items')
          .select('*, product:products(*)')
          .eq('order_id', orderId),
        supabase
          .from('stores')
          .select('*')
          .eq('id', orderData.store_id)
          .maybeSingle(),
      ]);

      if (itemsResult.error) throw itemsResult.error;
      if (storeResult.error) throw storeResult.error;

      setOrderItems(itemsResult.data || []);
      setStore(storeResult.data);

      if (orderData.driver_id) {
        const { data: driverLoc, error: driverError } = await supabase
          .from('driver_locations')
          .select('*')
          .eq('driver_id', orderData.driver_id)
          .maybeSingle();

        if (!driverError && driverLoc) {
          setDriverLocation(driverLoc);
        }
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Waiting for driver';
      case 'matched':
        return 'Driver assigned';
      case 'shopping':
        return 'Driver is shopping';
      case 'delivering':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'matched':
      case 'shopping':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 text-lg">Order not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/')} variant="outline" size="lg">
                ← Home
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Map</h2>
              <div className="h-96">
                <DeliveryMap
                  customerLat={order.delivery_latitude}
                  customerLng={order.delivery_longitude}
                  driverLat={driverLocation?.latitude}
                  driverLng={driverLocation?.longitude}
                  storeLat={store?.latitude}
                  storeLng={store?.longitude}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-lg">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Store</p>
                  <p className="font-semibold text-lg">{store?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold text-lg">{order.delivery_address}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-semibold text-lg">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Items</h2>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-lg">
                    <span>
                      {(item.product as any)?.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">P{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span className="font-semibold">P{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">P{order.delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold mt-2">
                    <span>Total:</span>
                    <span className="text-primary-600">P{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[600px]">
            {order.driver_id ? (
              <ChatBox orderId={order.id} userId={user.id} />
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-md h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-gray-600 text-lg">Waiting for a driver to accept your order</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
