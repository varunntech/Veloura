import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Upload, 
  X,
  Crown,
  TrendingUp,
  Eye,
  Search,
  Filter,
  Edit
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function Admin() {
  const { user } = useAuth();
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'orders'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'men' as 'men' | 'women',
    subcategory: '',
    sizes: [] as string[],
    image: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Crown className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif mb-4">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = JSON.parse(localStorage.getItem('veloura_users') || '[]').length;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resize large photos
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress aggressively to JPEG to safely fit safely in Firestore's 1MB limit
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const compressedBase64 = await compressImage(file);
        setPreviewImage(compressedBase64);
        setNewProduct(prev => ({ ...prev, image: compressedBase64 }));
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Failed to process image locally.");
        setPreviewImage('');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error('Please fill all required fields, including the image!');
      return;
    }

    if (isUploadingImage) {
      toast.error('Please wait for the image to finish uploading');
      return;
    }

    addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      image: newProduct.image,
      category: newProduct.category,
      subcategory: newProduct.subcategory || 'General',
      sizes: newProduct.sizes.length > 0 ? newProduct.sizes : ['One Size'],
      inStock: true
    });

    toast.success('Product added successfully!');
    setNewProduct({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'men',
      subcategory: '',
      sizes: [],
      image: ''
    });
    setPreviewImage('');
    setActiveTab('products');
  };

  const toggleSize = (size: string) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const statCards = [
    { 
      icon: Package, 
      title: 'Total Products', 
      value: totalProducts,
      trend: '+12%',
      color: 'bg-blue-500'
    },
    { 
      icon: ShoppingCart, 
      title: 'Total Orders', 
      value: totalOrders,
      trend: '+8%',
      color: 'bg-amber-500'
    },
    { 
      icon: DollarSign, 
      title: 'Revenue', 
      value: `₹${(totalRevenue / 1000).toFixed(1)}k`,
      trend: '+23%',
      color: 'bg-green-500'
    },
    { 
      icon: Users, 
      title: 'Customers', 
      value: totalCustomers,
      trend: '+15%',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-20">
      <div className="container-premium">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.name}</p>
          </div>
          <Badge className="bg-amber-500 text-white px-4 py-1.5">
            <Crown className="h-4 w-4 mr-1" />
            Admin
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'add-product', label: 'Add Product', icon: Plus },
            { id: 'orders', label: 'Orders', icon: ShoppingCart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">{stat.title}</p>
                  <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-slate-600">Order ID</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-600">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-t hover:bg-stone-50">
                        <td className="p-4 font-mono text-sm">{order.id}</td>
                        <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-medium">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-medium">All Products</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Price</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-stone-50">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image} alt={product.name} className="w-14 h-18 object-cover rounded-lg" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.subcategory}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through ml-2">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteProduct(product.id);
                              toast.success('Product deleted');
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-serif mb-8">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="max-w-3xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <Label className="text-base">Product Image *</Label>
                  <div className="mt-3">
                    {previewImage ? (
                      <div className="relative inline-block">
                        <img src={previewImage} alt="Preview" className="w-64 h-80 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage('');
                            setNewProduct({ ...newProduct, image: '' });
                          }}
                          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-64 h-80 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-colors"
                      >
                        <Upload className="h-10 w-10 mb-3" />
                        <span className="font-medium">Upload Image</span>
                        <span className="text-sm mt-1">Click to browse</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="md:col-span-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="mt-2"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="mt-2"
                    placeholder="Describe your product..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="mt-2"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="mt-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as 'men' | 'women' })}
                    className="w-full mt-2 border rounded-lg px-4 py-2.5"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    className="mt-2"
                    placeholder="e.g., Blazers, Dresses"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-5 py-2.5 border-2 rounded-lg font-medium transition-all ${
                          newProduct.sizes.includes(size)
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 hover:border-slate-400 text-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" className="mt-8 btn-gold px-10 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Product
              </Button>
            </form>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">All Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Order ID</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-stone-50">
                      <td className="p-4 font-mono text-sm">{order.id}</td>
                      <td className="p-4 text-sm">{order.shippingAddress.fullName}</td>
                      <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-medium">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
