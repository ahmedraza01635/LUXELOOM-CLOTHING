import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-900 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-5xl md:text-8xl font-bold leading-tight"
          >
            Essentials for the <br /> <span className="text-zinc-400 italic">Modern Wardrobe</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Curated pieces designed to elevate your everyday rotation. Minimalist aesthetics meets uncompromising quality.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-8"
          >
            <Link to="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 transition-all rounded-full px-8 py-6 text-lg group">
                Shop Collection <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/shop?category=Essentials" className="group relative h-[600px] overflow-hidden rounded-3xl bg-zinc-100">
            <img 
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2070&auto=format&fit=crop" 
              alt="Essentials"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
              <h3 className="text-white text-3xl font-serif font-bold">The Essentials</h3>
              <p className="text-zinc-300 mt-2">Foundation pieces for every look.</p>
            </div>
          </Link>
          <Link to="/shop?category=Streetwear" className="group relative h-[600px] overflow-hidden rounded-3xl bg-zinc-100">
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" 
              alt="Streetwear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
              <h3 className="text-white text-3xl font-serif font-bold">Contemporary Streetwear</h3>
              <p className="text-zinc-300 mt-2">Bold silhouettes, redefined.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
             <div className="bg-zinc-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto">
               <Star className="text-zinc-900" />
             </div>
             <h4 className="font-bold text-xl">Premium Quality</h4>
             <p className="text-zinc-500 text-sm">Sourced from the finest materials to ensure durability and comfort.</p>
          </div>
          <div className="space-y-4">
             <div className="bg-zinc-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto">
               <Truck className="text-zinc-900" />
             </div>
             <h4 className="font-bold text-xl">Global Shipping</h4>
             <p className="text-zinc-500 text-sm">Express delivery to over 50 countries worldwide with real-time tracking.</p>
          </div>
          <div className="space-y-4">
             <div className="bg-zinc-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto">
               <ShieldCheck className="text-zinc-900" />
             </div>
             <h4 className="font-bold text-xl">Secure Checkout</h4>
             <p className="text-zinc-500 text-sm">Your data is safe with our advanced encryption and payment protocols.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
