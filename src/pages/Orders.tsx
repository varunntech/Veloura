import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Package, ShoppingBag, ChevronRight, Calendar, MapPin, CreditCard, X } from 'lucide-react';

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
  const { user, isLoading: authLoading } = useAuth();
  const { getUserOrders, isLoading: ordersLoading } = useOrders();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState<any>(null);
  
  const orders = user ? getUserOrders(user.id) : [];

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart(item.product, item.size, item.quantity);
    });
    toast.success('All items added back to your cart!');
    navigate('/cart');
  };

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-500 font-serif">Loading your orders...</p>
        </div>
      </div>
    );
  }

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
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveOrder(order)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="btn-gold"
                    >
                      Reorder
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative animate-scale-in">
            {/* Close Button */}
            <button 
              onClick={() => setActiveOrder(null)}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-serif text-slate-900 mb-2">Order Details</h2>
            <p className="text-sm text-slate-500 font-mono mb-6">ID: {activeOrder.id}</p>

            {/* Status & Date */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Date Placed</p>
                <p className="font-medium text-slate-700">{new Date(activeOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
              <Badge className={`${statusColors[activeOrder.status]} px-3 py-1`}>
                {statusLabels[activeOrder.status]}
              </Badge>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="font-medium text-slate-900 mb-3 text-sm">Items Ordered</h3>
              <div className="space-y-4 max-h-40 overflow-y-auto pr-1">
                {activeOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-xs truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">Size: {item.size} × {item.quantity}</p>
                    </div>
                    <p className="font-medium text-slate-900 text-xs">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6 bg-stone-50 rounded-xl p-4 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{(activeOrder.totalAmount * 0.82).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span>₹{(activeOrder.totalAmount * 0.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-900 font-semibold text-sm border-t pt-2.5 mt-2">
                <span>Total Amount Paid</span>
                <span className="text-amber-600 font-bold">₹{activeOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-6">
              <h3 className="font-medium text-slate-900 mb-2.5 text-sm">Delivery Information</h3>
              <div className="bg-stone-50 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800 mb-1">{activeOrder.shippingAddress.fullName}</p>
                <p>{activeOrder.shippingAddress.addressLine1}</p>
                {activeOrder.shippingAddress.addressLine2 && <p>{activeOrder.shippingAddress.addressLine2}</p>}
                <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}</p>
                <p className="mt-1 font-medium text-slate-800">Phone: {activeOrder.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setActiveOrder(null)}
                className="flex-1 border-slate-900 text-slate-900"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  handleReorder(activeOrder);
                  setActiveOrder(null);
                }}
                className="flex-1 btn-gold"
              >
                Reorder Items
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
