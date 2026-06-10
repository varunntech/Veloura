import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Heart, ShoppingBag, ArrowRight, Trash2, Star } from 'lucide-react';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    const defaultSize = product.sizes[0];
    addToCart(product, defaultSize, 1);
    removeFromWishlist(product.id);
    toast.success('Moved to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="container-premium">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-slate-300" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Save your favorite items to your wishlist and they'll be waiting for you when you're ready
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
          <span className="text-slate-900">Wishlist</span>
        </div>

        <h1 className="text-4xl font-serif text-slate-900 mb-2">My Wishlist</h1>
        <p className="text-slate-500 mb-10">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <div key={product.id} className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.rating && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  {product.subcategory}
                </p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-serif text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-semibold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 btn-gold"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromWishlist(product.id)}
                    className="border-red-200 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/shop/all">
            <Button variant="outline" size="lg" className="border-slate-900">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
