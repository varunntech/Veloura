import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Heart, 
  Check, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, addReview } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  const product = getProduct(id || '');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
          <p className="text-slate-500 mb-6">The product you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/shop/all')} className="btn-gold">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setIsAdding(true);
    addToCart(product, selectedSize, quantity);
    toast.success('Added to cart!');
    setIsAdding(false);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate('/cart');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }
    addReview(product.id, {
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment
    });
    toast.success('Review submitted!');
    setShowReviewForm(false);
    setReviewComment('');
    setReviewRating(5);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            className={interactive ? 'hover:scale-110 transition-transform' : ''}
            disabled={!interactive}
          >
            <Star 
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'text-slate-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container-premium">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-900">Home</Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Link to={`/shop/${product.category}`} className="text-slate-500 hover:text-slate-900 capitalize">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-stone-100 overflow-hidden rounded-xl">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-24 overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === idx ? 'border-amber-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:py-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-4">
                {renderStars(Math.round(product.rating))}
                <span className="text-slate-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-semibold text-slate-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 mb-3">
                Select Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3.5rem] h-12 px-4 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-900 mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-slate-200 rounded-lg hover:border-slate-400 flex items-center justify-center transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-16 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-slate-200 rounded-lg hover:border-slate-400 flex items-center justify-center transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-2"
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {inWishlist ? 'Saved' : 'Wishlist'}
              </Button>
              <Button
                size="lg"
                className="flex-1 btn-gold"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800 mb-8"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </Button>

            {!product.inStock && (
              <p className="text-red-500 text-center mb-6">This product is currently out of stock</p>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: Shield, text: 'Authentic Product' },
                { icon: RotateCcw, text: 'Easy Returns' }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <item.icon className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-xs text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t">
          <div className="flex gap-8 border-b">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 text-sm font-medium uppercase tracking-wide relative ${
                  activeTab === tab 
                    ? 'text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-serif mb-4">Product Details</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Premium quality materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Expert craftsmanship</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Authentic guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Easy 30-day returns</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-serif mb-1">Customer Reviews</h3>
                    <p className="text-slate-500">
                      {product.reviewCount || 0} {product.reviewCount === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Write a Review
                  </Button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-stone-50 p-6 rounded-xl mb-8">
                    <h4 className="font-medium mb-4">Your Review</h4>
                    <div className="mb-4">
                      <label className="block text-sm text-slate-600 mb-2">Rating</label>
                      {renderStars(reviewRating, true, setReviewRating)}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-slate-600 mb-2">Your Review</label>
                      <Textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="btn-gold">Submit Review</Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {product.reviews?.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="font-medium text-amber-700">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-serif mb-4">Shipping & Returns</h3>
                <div className="space-y-4 text-slate-600">
                  <p>
                    <strong className="text-slate-900">Free Shipping:</strong> We offer complimentary 
                    shipping on all orders above ₹5000. Orders below this amount have a flat shipping 
                    fee of ₹199.
                  </p>
                  <p>
                    <strong className="text-slate-900">Delivery Time:</strong> Orders are typically 
                    processed within 1-2 business days. Delivery takes 5-7 business days depending on 
                    your location.
                  </p>
                  <p>
                    <strong className="text-slate-900">Easy Returns:</strong> Not satisfied? Return 
                    any item within 30 days of delivery for a full refund. Items must be unworn with 
                    original tags attached.
                  </p>
                  <p>
                    <strong className="text-slate-900">Tracking:</strong> Once your order ships, 
                    you'll receive an email with tracking information to monitor your delivery.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
