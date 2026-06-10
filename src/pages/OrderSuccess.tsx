import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home, ShoppingBag, Truck, Mail, MapPin } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';
  const stateOrder = location.state?.order;
  const { getOrder } = useOrders();
  const dbOrder = getOrder(orderId);
  const order = stateOrder || dbOrder;

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20">
      <div className="container-premium">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-serif text-slate-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-slate-600 mb-2">
              Thank you for shopping with Veloura
            </p>
            <p className="text-slate-500 mb-8">
              Order ID: <span className="font-mono text-slate-900">{orderId}</span>
            </p>

            {/* Order Summary */}
            {order && (
              <div className="border border-stone-200 rounded-xl p-6 mb-8 text-left bg-stone-50/50 animate-fade-in">
                <h3 className="font-serif text-lg text-slate-900 mb-4 pb-2 border-b">Order Summary</h3>
                <div className="space-y-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <p className="font-medium text-slate-900 text-sm flex-shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between items-center font-medium text-slate-900">
                  <span className="text-sm text-slate-600">Total Paid</span>
                  <span className="text-lg text-amber-600 font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                {order.shippingAddress && (
                  <div className="border-t mt-4 pt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                      <span>Shipping Address</span>
                    </div>
                    <p className="font-medium text-slate-800">{order.shippingAddress.fullName}</p>
                    <p className="mt-0.5">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    </p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    {order.shippingAddress.phone && <p className="mt-1">Phone: {order.shippingAddress.phone}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-stone-50 rounded-xl p-6 mb-8">
              <h3 className="font-medium text-slate-900 mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                What's Next?
              </h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, title: 'Order Confirmation', desc: 'You will receive an email confirmation shortly' },
                  { icon: Package, title: 'Order Processing', desc: 'We are preparing your items for shipment' },
                  { icon: Truck, title: 'Shipping', desc: 'We will notify you when your order ships' },
                  { icon: Home, title: 'Delivery', desc: 'Estimated delivery: 5-7 business days' }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <step.icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/orders">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-900">
                  <Package className="mr-2 h-5 w-5" />
                  View Orders
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto btn-gold">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Need help? Contact us at{' '}
              <a href="mailto:care@veloura.com" className="text-amber-600 hover:text-amber-700">
                care@veloura.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
