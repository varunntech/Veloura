import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CreditCard, Shield, Check, ChevronRight, MapPin } from 'lucide-react';
import { sendOrderEmail } from '@/lib/email';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, updateOrderPayment } = useOrders();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const taxAmount = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + taxAmount;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    const order = createOrder(user?.id || 'guest', items, grandTotal, {
      fullName: formData.fullName,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    });

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Razorpay SDK failed to load');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SdCEtdf6wJnIq1',
      amount: grandTotal * 100,
      currency: 'INR',
      name: 'Veloura',
      description: 'Premium Fashion Purchase',
      image: 'https://your-logo-url.com/logo.png',
      order_id: '',
      handler: function (response: any) {
        updateOrderPayment(order.id, response.razorpay_payment_id);
        clearCart();
        toast.success('Payment successful!');
        
        // Send order confirmation email
        sendOrderEmail(formData.email, formData.fullName, order.id, grandTotal);

        navigate('/order-success', { state: { orderId: order.id } });
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.addressLine1}, ${formData.city}`
      },
      theme: {
        color: '#0f172a'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
    razorpay.on('payment.failed', function (response: any) {
      toast.error('Payment failed: ' + response.error.description);
      setIsProcessing(false);
    });

    setIsProcessing(false);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container-premium">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-900">Home</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Link to="/cart" className="text-slate-500 hover:text-slate-900">Cart</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-900">Checkout</span>
        </div>

        <h1 className="text-4xl font-serif text-slate-900 mb-2">Checkout</h1>
        
        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-slate-900' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'shipping' ? 'bg-slate-900 text-white' : 'bg-green-500 text-white'
            }`}>
              {step === 'shipping' ? '1' : <Check className="h-4 w-4" />}
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="w-16 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-slate-900' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'payment' ? 'bg-slate-900 text-white' : 'bg-slate-200'
            }`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="bg-stone-50 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-serif">Shipping Address</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="mt-1.5"
                      placeholder="Building, floor, landmark (optional)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-gold mt-8 py-6"
                  size="lg"
                >
                  Continue to Payment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <div className="bg-stone-50 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-serif">Payment Method</h2>
                </div>

                <div className="bg-white rounded-lg p-6 mb-6 border-2 border-amber-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                      <img 
                        src="https://cdn.razorpay.com/static/assets/logo/payment.svg" 
                        alt="Razorpay" 
                        className="h-6"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Razorpay Secure Payment</p>
                      <p className="text-sm text-slate-500">Cards, UPI, Net Banking & more</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Secure Checkout</p>
                      <p className="text-sm text-amber-700">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('shipping')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 btn-gold py-6"
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{grandTotal.toLocaleString()}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-stone-50 rounded-xl p-6">
              <h2 className="text-xl font-serif text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-500">Size: {item.size} × {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (18% GST)</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
