import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Truck, 
  Shield, 
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const { products } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 3);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop',
      title: 'The Art of Elegance',
      subtitle: 'Discover our exclusive collection of handcrafted luxury fashion'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop',
      title: 'Timeless Sophistication',
      subtitle: 'Where tradition meets contemporary design'
    },
    {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop',
      title: 'Crafted for You',
      subtitle: 'Bespoke pieces that define your unique style'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuredRef.current) {
      observer.observe(featuredRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-premium">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6 animate-slide-up">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 text-sm tracking-[0.3em] uppercase font-medium">
                  Premium Collection 2024
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 animate-slide-up stagger-1">
                {heroSlides[currentSlide].title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 font-light animate-slide-up stagger-2">
                {heroSlides[currentSlide].subtitle}
              </p>
              
              <div className="flex flex-wrap gap-4 animate-slide-up stagger-3">
                <Link to="/shop/all">
                  <Button 
                    size="lg" 
                    className="btn-gold px-10 py-6 text-base"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/shop/men">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-slate-900 px-10 py-6 text-base"
                  >
                    Shop Men
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-amber-400' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="bg-slate-900 py-16">
        <div className="container-premium">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹5000' },
              { icon: Shield, title: 'Authentic Guarantee', desc: '100% genuine products' },
              { icon: Award, title: 'Premium Quality', desc: 'Curated luxury collection' },
              { icon: Star, title: '5-Star Service', desc: 'Dedicated support team' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <item.icon className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-stone-50">
        <div className="container-premium">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium">
                Just Landed
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-2">
                New Arrivals
              </h2>
            </div>
            <Link 
              to="/shop/all" 
              className="hidden md:flex items-center gap-2 text-slate-700 hover:text-slate-900 underline-animation"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white mb-5 image-zoom">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-500 text-white border-0">
                      New
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Quick View
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">{product.subcategory}</p>
                  <h3 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-semibold text-lg">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section ref={featuredRef} className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-16">
            <span className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-2 mb-4">
              Featured Collection
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Handpicked pieces that embody the essence of luxury and sophistication
            </p>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group card-hover"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white border-0">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  )}
                  {product.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    {product.subcategory}
                  </p>
                  <h3 className="font-serif text-lg text-slate-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop/all">
              <Button variant="outline" size="lg" className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section-padding bg-slate-900">
        <div className="container-premium">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-sm tracking-[0.2em] uppercase font-medium">
              Shop by Category
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mt-2">
              For Him & Her
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/shop/men" className="group relative h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1490578474895-531eba835eb1?w=800&auto=format&fit=crop"
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-amber-400 text-sm tracking-[0.2em] uppercase">Collection</span>
                <h3 className="text-4xl font-serif text-white mt-2 mb-4">Men</h3>
                <p className="text-white/70 mb-6 max-w-sm">
                  Discover refined tailoring and contemporary classics for the modern gentleman
                </p>
                <span className="inline-flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link to="/shop/women" className="group relative h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop"
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-amber-400 text-sm tracking-[0.2em] uppercase">Collection</span>
                <h3 className="text-4xl font-serif text-white mt-2 mb-4">Women</h3>
                <p className="text-white/70 mb-6 max-w-sm">
                  Elegant designs that celebrate femininity and timeless sophistication
                </p>
                <span className="inline-flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-stone-50">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <Star className="h-10 w-10 text-amber-400 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-serif text-slate-900 mb-8 leading-relaxed">
              "Veloura has redefined luxury shopping for me. The attention to detail in every piece 
              and the exceptional service make it my go-to destination for premium fashion."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" 
                  alt="Customer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900">Ananya Desai</p>
                <p className="text-sm text-slate-500">Loyal Customer since 2022</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
