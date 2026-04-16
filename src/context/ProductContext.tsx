import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Review } from '@/types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getByCategory: (category: 'men' | 'women') => Product[];
  searchProducts: (query: string) => Product[];
  addReview: (productId: string, review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const sampleReviews: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Arjun Mehta',
    rating: 5,
    comment: 'Exceptional quality! The fabric feels luxurious and the fit is perfect.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely stunning piece. Worth every penny!',
    createdAt: new Date().toISOString()
  }
];

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Royal Velvet Tuxedo Blazer',
    description: 'Handcrafted from the finest Italian velvet, this tuxedo blazer exudes sophistication. Features gold-plated buttons, silk lining, and a tailored silhouette that commands attention at any formal occasion.',
    price: 24999,
    originalPrice: 32999,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&auto=format&fit=crop'
    ],
    category: 'men',
    subcategory: 'Blazers',
    sizes: ['38', '40', '42', '44', '46'],
    inStock: true,
    rating: 4.9,
    reviewCount: 28,
    reviews: sampleReviews,
    tags: ['Premium', 'Bestseller', 'Formal'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Midnight Silk Evening Gown',
    description: 'An ethereal silk gown that flows like liquid moonlight. Hand-embroidered with delicate crystal embellishments, this piece is designed for the woman who appreciates timeless elegance.',
    price: 45999,
    originalPrice: 59999,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop'
    ],
    category: 'women',
    subcategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 5.0,
    reviewCount: 42,
    reviews: sampleReviews,
    tags: ['Luxury', 'Exclusive', 'Evening'],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Heritage Cashmere Overcoat',
    description: 'Woven from Mongolian cashmere, this overcoat offers unparalleled warmth and softness. The classic double-breasted design with genuine horn buttons makes it a wardrobe staple for generations.',
    price: 34999,
    originalPrice: 44999,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop'
    ],
    category: 'men',
    subcategory: 'Coats',
    sizes: ['M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.8,
    reviewCount: 19,
    reviews: [sampleReviews[0]],
    tags: ['Winter', 'Premium', 'Classic'],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Éclat Leather Handbag',
    description: 'Hand-stitched by master artisans using full-grain Italian leather. The gold-tone hardware and signature lining make this handbag the epitome of understated luxury.',
    price: 28999,
    originalPrice: 36999,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop'
    ],
    category: 'women',
    subcategory: 'Accessories',
    sizes: ['One Size'],
    inStock: true,
    rating: 4.9,
    reviewCount: 56,
    reviews: sampleReviews,
    tags: ['Handcrafted', 'Italian Leather', 'Signature'],
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Bespoke Oxford Shoes',
    description: 'Each pair takes 200 hours to craft using the traditional Goodyear welt method. The calfskin leather develops a unique patina over time, making every pair truly one-of-a-kind.',
    price: 18999,
    originalPrice: 24999,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop'
    ],
    category: 'men',
    subcategory: 'Shoes',
    sizes: ['7', '8', '9', '10', '11', '12'],
    inStock: true,
    rating: 4.7,
    reviewCount: 34,
    reviews: [sampleReviews[1]],
    tags: ['Handmade', 'Bespoke', 'Classic'],
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Imperial Pearl Collection',
    description: 'South Sea pearls of exceptional luster, set in 18k gold. This heirloom-quality set includes a necklace and matching earrings, presented in a velvet-lined walnut box.',
    price: 89999,
    originalPrice: 119999,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop'
    ],
    category: 'women',
    subcategory: 'Jewelry',
    sizes: ['One Size'],
    inStock: true,
    rating: 5.0,
    reviewCount: 12,
    reviews: sampleReviews,
    tags: ['Heirloom', '18k Gold', 'Exclusive'],
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Aristocrat Wool Suit',
    description: 'Super 180s wool from Loro Piana, tailored to perfection. The half-canvas construction ensures the jacket molds to your body over time for a truly personalized fit.',
    price: 54999,
    originalPrice: 69999,
    image: 'https://images.unsplash.com/photo-1593032465175-d529cb1e790e?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593032465175-d529cb1e790e?w=800&auto=format&fit=crop'
    ],
    category: 'men',
    subcategory: 'Suits',
    sizes: ['38', '40', '42', '44', '46'],
    inStock: true,
    rating: 4.9,
    reviewCount: 23,
    reviews: [sampleReviews[0]],
    tags: ['Loro Piana', 'Bespoke', 'Premium'],
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Couture Lace Cocktail Dress',
    description: 'French Chantilly lace overlays silk charmeuse in this breathtaking cocktail dress. The hand-beaded bodice and flowing skirt create an unforgettable silhouette.',
    price: 32999,
    originalPrice: 42999,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop'
    ],
    category: 'women',
    subcategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    rating: 4.8,
    reviewCount: 31,
    reviews: sampleReviews,
    tags: ['Couture', 'Lace', 'Exclusive'],
    createdAt: new Date().toISOString()
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed database if entirely empty
        console.log("Collection empty. Seeding initial products...");
        try {
          for (const sp of sampleProducts) {
            await setDoc(doc(db, 'products', sp.id), sp);
          }
        } catch (e) {
          console.log("Could not seed data. Check your Firebase security rules.", e);
        }
      } else {
        const productsData = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Product));
        // Sort newest first
        productsData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProducts(productsData);
      }
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newId = Date.now().toString();
    const newProduct: Product = {
      ...product,
      id: newId,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'products', newId), newProduct);
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (e) {
      console.error("Error updating product: ", e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Error deleting product: ", e);
    }
  };

  const getProduct = (id: string) => products.find(p => p.id === id);
  const getByCategory = (category: 'men' | 'women') => products.filter(p => p.category === category);
  
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.subcategory.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const addReview = async (productId: string, review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: 'r' + Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedReviews = [...(product.reviews || []), newReview];
    const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
    
    try {
      await updateDoc(doc(db, 'products', productId), {
        reviews: updatedReviews,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: updatedReviews.length
      });
    } catch (e) {
      console.error("Error adding review: ", e);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, addProduct, updateProduct, deleteProduct, 
      getProduct, getByCategory, searchProducts, addReview 
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
