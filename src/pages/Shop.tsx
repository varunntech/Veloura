import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  SlidersHorizontal, 
  ChevronDown,
  Search,
  Grid3X3,
  LayoutList
} from 'lucide-react';

export default function Shop() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const { products, getByCategory, searchProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  let displayProducts = searchQuery 
    ? searchProducts(searchQuery)
    : selectedCategory === 'all' 
      ? products 
      : getByCategory(selectedCategory as 'men' | 'women');

  // Apply price filter
  displayProducts = displayProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // Apply sorting
  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'men', name: 'Men', count: getByCategory('men').length },
    { id: 'women', name: 'Women', count: getByCategory('women').length }
  ];

  const subcategories = [...new Set(products.map(p => p.subcategory))];

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container-premium">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Shop</span>
          </div>
          
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">
                {searchQuery ? `Search: "${searchQuery}"` : 
                 selectedCategory === 'all' ? 'All Products' : 
                 selectedCategory === 'men' ? "Men's Collection" : "Women's Collection"}
              </h1>
              <p className="text-slate-500">
                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-28 space-y-8">
              {/* Search */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === cat.id 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24"
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Subcategories */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Subcategories</h3>
                <div className="flex flex-wrap gap-2">
                  {subcategories.map((sub) => (
                    <Badge 
                      key={sub} 
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 rounded-2xl">
                <Search className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-medium text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {sortedProducts.map((product) => (
                  viewMode === 'grid' ? (
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
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                        {product.rating && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <span className="text-slate-900 font-medium">Out of Stock</span>
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
                  ) : (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className="group flex gap-6 p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="relative w-32 h-40 flex-shrink-0 overflow-hidden bg-stone-100 rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 py-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                              {product.subcategory}
                            </p>
                            <h3 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                              {product.description}
                            </p>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{product.rating}</span>
                                <span className="text-sm text-slate-400">({product.reviewCount} reviews)</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-semibold block">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-slate-400 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
