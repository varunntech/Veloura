import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home, ShoppingBag, Truck, Mail } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';

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
