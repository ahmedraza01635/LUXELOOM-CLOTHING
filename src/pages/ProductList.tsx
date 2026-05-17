import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    if (categoryFilter) {
      q = query(collection(db, 'products'), where('category', '==', categoryFilter), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter]);

  const categories: (Category | 'All')[] = ['All', 'Essentials', 'Accessories', 'Footwear', 'Streetwear'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold">Our Collection</h1>
          <p className="text-zinc-500 mt-2">Explore our latest arrivals and timeless staples.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              to={cat === 'All' ? '/shop' : `/shop?category=${cat}`}
            >
              <Button 
                variant={ (categoryFilter === cat) || (cat === 'All' && !categoryFilter) ? 'default' : 'outline' }
                className="rounded-full"
              >
                {cat}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 px-4 bg-zinc-50 rounded-3xl">
          <h3 className="text-xl font-medium text-zinc-400">No products found in this category.</h3>
          <Link to="/shop">
            <Button variant="link" className="mt-4">View All Products</Button>
          </Link>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-black border-none hover:bg-white">{product.category}</Badge>
                  </div>
                  <div className="mt-4 space-y-1">
                    <h3 className="font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors uppercase text-sm tracking-wide">{product.name}</h3>
                    <p className="text-zinc-500 font-serif">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
