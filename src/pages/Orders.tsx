import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, ChevronRight, Calendar, MapPin, CreditCard } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function Orders() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const orders = user ? getUserOrders(user.id) : [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-28 pb-20">
        <div className="container-premium">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-4">No Orders Yet</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start shopping to see your orders here. Discover our premium collection today.
            </p>
            <Link to="/shop/all">
              <Button size="lg" className="btn-gold">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20">
      <div className="container-premium">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-900">Home</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-900">My Orders</span>
        </div>

        <h1 className="text-4xl font-serif text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-500 mb-10">Track and manage your orders</p>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b bg-stone-50/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Order ID</p>
                      <p className="font-mono font-medium">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total</p>
                      <p className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge className={`${statusColors[order.status]} px-4 py-1.5`}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-24 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link 
                          to={`/product/${item.product.id}`}
                          className="font-medium text-slate-900 hover:text-amber-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-slate-500 mt-1">
                          Size: {item.size} × {item.quantity}
                        </p>
                        <p className="font-medium mt-2">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 border-t bg-stone-50/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </div>
                    {order.paymentId && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-mono">{order.paymentId}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
