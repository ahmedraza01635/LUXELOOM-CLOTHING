import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Product, Category } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Trash2, Edit2, Package, LayoutDashboard, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Essentials',
    images: [''],
    stock: 0
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Admin access required');
      navigate('/admin/login');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp(),
      });
      toast.success('Product added successfully');
      setNewProduct({ name: '', description: '', price: 0, category: 'Essentials', images: [''], stock: 0 });
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  if (authLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  if (!isAdmin) {
      return (
          <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
              <h1 className="text-3xl font-bold">Admin Privileges Required</h1>
              <p>Your current role is: <strong>{profile?.role || 'None'}</strong></p>
              <p className="text-zinc-500">Only the authorized store owner can access this dashboard.</p>
          </div>
      )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-serif font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
           <Link to="/shop" className="text-sm font-medium flex items-center gap-1 hover:underline"><ShoppingBag size={16}/> View Store</Link>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-8">
        <TabsList className="bg-zinc-100 p-1 rounded-full w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="products" className="rounded-full data-[state=active]:bg-white">
            <Package className="mr-2" size={16} /> Inventory
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-full data-[state=active]:bg-white">
            <LayoutDashboard className="mr-2" size={16} /> Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full"><Plus className="mr-2" size={16} /> New Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Minimalist Linen Shirt" 
                      value={newProduct.name} 
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                    >
                       <option value="Essentials">Essentials</option>
                       <option value="Accessories">Accessories</option>
                       <option value="Footwear">Footwear</option>
                       <option value="Streetwear">Streetwear</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      value={newProduct.price} 
                      onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Inventory Level</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      value={newProduct.stock} 
                      onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input 
                      id="image" 
                      placeholder="https://images.unsplash.com/..." 
                      value={newProduct.images?.[0] || ''} 
                      onChange={e => setNewProduct({...newProduct, images: [e.target.value]})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <textarea 
                      id="desc"
                      className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell more about the product..."
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button type="submit" disabled={loading} className="w-full rounded-full h-12">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 border-none hover:bg-zinc-50">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="w-12 h-16 rounded-lg bg-zinc-100 overflow-hidden">
                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                    <TableCell>${p.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={p.stock < 10 ? 'text-red-500 font-bold' : ''}>{p.stock}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center py-20 text-zinc-400">No products in inventory. Start by adding one!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="py-20 text-center bg-zinc-50 rounded-3xl">
           <div className="max-w-md mx-auto space-y-4">
              <LayoutDashboard size={48} className="mx-auto text-zinc-300" />
              <h3 className="text-xl font-bold">Analytics Coming Soon</h3>
              <p className="text-zinc-500">We are busy building detailed insights for your store performance.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
