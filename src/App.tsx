/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut, ShieldCheck } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Button } from './components/ui/button';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
  const { user, isAdmin } = useAuth();
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tighter">
            LUXE<span className="text-zinc-400">LOOM</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/shop" className="text-sm font-medium hover:text-zinc-500 transition-colors">Shop</Link>
            {isAdmin && <Link to="/admin" className="text-sm font-medium flex items-center gap-1 text-indigo-600"><ShieldCheck size={16}/> Admin</Link>}
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 hidden lg:block">{user.email}</span>
                  <Button variant="ghost" size="icon" onClick={() => signOut(auth)}>
                    <LogOut size={20} />
                  </Button>
                </div>
              ) : (
                <Link to="/admin/login">
                  <Button variant="ghost" size="icon">
                    <UserIcon size={20} />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-zinc-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/shop" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Shop</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Cart ({cartCount})</Link>
              {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-indigo-600">Admin Dashboard</Link>}
              {user ? (
                <button onClick={() => { signOut(auth); setIsOpen(false); }} className="block text-lg font-medium text-red-600">Logout</button>
              ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <motion.main
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pt-16 min-h-screen"
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/shop" element={<PageWrapper><ProductList /></PageWrapper>} />
              <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
              <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
          <footer className="bg-white border-t border-zinc-200 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="font-serif text-xl font-bold mb-4">LUXELOOM</h2>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                Elevating your daily essentials through refined design and sustainable craft.
              </p>
              <div className="mt-8 text-xs text-zinc-400">
                &copy; 2026 Luxe Loom Clothing. All rights reserved.
              </div>
            </div>
          </footer>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
