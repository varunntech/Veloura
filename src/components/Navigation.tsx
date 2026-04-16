import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Package, 
  LayoutDashboard, 
  Heart,
  Search,
  ChevronRight,
  Crown
} from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { searchProducts } = useProducts();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchProducts]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/all?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        {/* Top Bar */}
        <div className={`transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden' : 'h-8 bg-slate-900'}`}>
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
            <p className="text-xs text-white/80 tracking-widest uppercase">
              Free Shipping on Orders Above ₹5000
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Crown className={`h-6 w-6 transition-colors duration-300 ${
                isScrolled ? 'text-amber-600' : 'text-amber-500'
              }`} />
              <span className={`text-2xl font-serif font-bold tracking-wide transition-colors duration-300 ${
                isScrolled ? 'text-slate-900' : 'text-slate-900'
              }`}>
                Veloura
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {['Home', 'Shop', 'Men', 'Women'].map((item) => (
                <Link 
                  key={item}
                  to={item === 'Home' ? '/' : item === 'Shop' ? '/shop/all' : `/shop/${item.toLowerCase()}`}
                  className={`text-sm font-medium tracking-wide uppercase underline-animation transition-colors duration-300 ${
                    isScrolled ? 'text-slate-700 hover:text-slate-900' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'hover:bg-slate-100 text-slate-700' 
                    : 'hover:bg-white/20 text-slate-700'
                }`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className={`relative p-2.5 rounded-full transition-all duration-300 hidden sm:block ${
                  isScrolled 
                    ? 'hover:bg-slate-100 text-slate-700' 
                    : 'hover:bg-white/20 text-slate-700'
                }`}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className={`relative p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'hover:bg-slate-100 text-slate-700' 
                    : 'hover:bg-white/20 text-slate-700'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`p-2.5 rounded-full transition-all duration-300 ${
                      isScrolled 
                        ? 'hover:bg-slate-100 text-slate-700' 
                        : 'hover:bg-white/20 text-slate-700'
                    }`}>
                      <User className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <div className="px-3 py-3 border-b">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/orders')} className="py-2.5">
                      <Package className="mr-3 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')} className="py-2.5">
                      <Heart className="mr-3 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="py-2.5">
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="py-2.5 text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:flex border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'hover:bg-slate-100 text-slate-700' 
                    : 'hover:bg-white/20 text-slate-700'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white border-t px-4 py-6 space-y-4 shadow-xl">
            {['Home', 'Shop', 'Men', 'Women'].map((item) => (
              <Link 
                key={item}
                to={item === 'Home' ? '/' : item === 'Shop' ? '/shop/all' : `/shop/${item.toLowerCase()}`}
                className="flex items-center justify-between py-3 text-slate-700 hover:text-slate-900 border-b border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">{item}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ))}
            <Link 
              to="/wishlist"
              className="flex items-center justify-between py-3 text-slate-700 hover:text-slate-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-medium">Wishlist</span>
              <Heart className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in">
          <div ref={searchRef} className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  autoFocus
                  placeholder="Search for products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-12 py-6 text-lg border-0 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </form>
              
              {searchResults.length > 0 && (
                <div className="border-t max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.subcategory}</p>
                      </div>
                      <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                    </Link>
                  ))}
                </div>
              )}
              
              {searchQuery && searchResults.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
