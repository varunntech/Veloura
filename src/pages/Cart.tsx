import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, Gift, Truck } from 'lucide-react';
import { useState } from 'react';

const coupons = [
  { code: 'VELORA10', discount: 10, type: 'percentage', desc: '10% off on all orders' },
  { code: 'WELCOME500', discount: 500, type: 'fixed', desc: '₹500 off on orders above ₹5000' }
];

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      if (coupon.type === 'fixed' && totalAmount < 5000) {
        setCouponError('Minimum order value of ₹5000 required');
        return;
      }
      setAppliedCoupon(coupon);
      toast.success(`Coupon applied! You saved ${coupon.type === 'percentage' ? coupon.discount + '%' : '₹' + coupon.discount}`);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const discountAmount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? Math.round(totalAmount * appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;

  const finalAmount = totalAmount - discountAmount;
  const taxAmount = Math.round(finalAmount * 0.18);
  const grandTotal = finalAmount + taxAmount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="container-premium">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Discover our premium collection and add something extraordinary to your cart
            </p>
            <Link to="/shop/all">
              <Button size="lg" className="btn-gold">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container-premium">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-900">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">Shopping Cart</span>
        </div>

        <h1 className="text-4xl font-serif text-slate-900 mb-2">Shopping Cart</h1>
        <p className="text-slate-500 mb-10">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-6 p-5 bg-stone-50 rounded-xl">
                <Link to={`/product/${item.product.id}`} className="w-28 h-36 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{item.product.subcategory}</p>
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="font-serif text-lg text-slate-900 hover:text-amber-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">Size: {item.size}</p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.product.id, item.size);
                        toast.success('Item removed');
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-9 h-9 border-2 border-slate-200 rounded-lg hover:border-slate-400 flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-9 h-9 border-2 border-slate-200 rounded-lg hover:border-slate-400 flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xl font-semibold">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <Link to="/shop/all" className="text-slate-600 hover:text-slate-900 underline-animation">
                Continue Shopping
              </Link>
              <button 
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-stone-50 rounded-xl p-6">
              <h2 className="text-xl font-serif text-slate-900 mb-6">Order Summary</h2>
              
              {/* Coupon */}
              {!appliedCoupon ? (
                <div className="mb-6">
                  <label className="block text-sm text-slate-600 mb-2">Apply Coupon</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                </div>
              ) : (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-medium">{appliedCoupon.code}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Including all taxes</p>
              </div>

              <Button 
                className="w-full btn-gold py-6 text-base"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Payments" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
