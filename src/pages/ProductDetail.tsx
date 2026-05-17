import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, Truck, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error('Product not found');
          navigate('/shop');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[600px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100"
          >
            <img 
              src={product.images?.[activeImage] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-black' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-[0.2em] mb-2">{product.category}</h4>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-serif text-zinc-900 mb-8">${product.price.toFixed(2)}</p>
          
          <div className="prose prose-zinc mb-12">
            <p className="text-zinc-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="space-y-6 mt-auto">
            <Button 
               size="lg" 
               className="w-full h-14 rounded-full text-lg font-medium"
               onClick={() => {
                 addToCart(product);
                 toast.success('Added to cart');
               }}
            >
              Add to Cart <ShoppingCart className="ml-2" />
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-zinc-100">
              <div className="flex items-center gap-3 text-zinc-500">
                <Truck size={20} />
                <div className="text-xs">
                  <p className="font-medium text-zinc-900">Free delivery</p>
                  <p>On orders over $150</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <RefreshCw size={20} />
                <div className="text-xs">
                  <p className="font-medium text-zinc-900">30 days return</p>
                  <p>Simple and free returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
