import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
        <div className="bg-zinc-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="text-zinc-400" size={40} />
        </div>
        <h1 className="text-4xl font-serif font-bold">Your cart is empty</h1>
        <p className="text-zinc-500 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="inline-block mt-8">
          <Button size="lg" className="rounded-full px-12">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-serif font-bold mb-12">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-6 pb-8 border-b border-zinc-100"
              >
                <div className="w-32 h-40 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg uppercase tracking-tight">{item.name}</h3>
                      <p className="text-zinc-500 text-sm">{item.category}</p>
                    </div>
                    <p className="font-serif font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-zinc-200 rounded-full px-2 py-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-black"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-black"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-50 rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="pt-4 border-t border-zinc-200 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="font-serif">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full h-14 rounded-full text-lg font-medium group">
              Checkout <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-center text-xs text-zinc-400 mt-6 mt-4">
              Complimentary shipping on orders over $150.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
