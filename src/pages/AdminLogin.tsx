import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists and their role
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create as customer by default
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: 'customer',
          displayName: user.displayName || '',
        });
        toast.success('Account created. Accessing store...');
        navigate('/shop');
      } else {
        const profile = userSnap.data();
        if (profile.role === 'admin') {
          toast.success('Admin login successful');
          navigate('/admin');
        } else {
          toast.info('Logged in as customer');
          navigate('/shop');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-black text-white p-10 text-center">
          <CardTitle className="font-serif text-3xl">LUXE LOOM</CardTitle>
          <CardDescription className="text-zinc-400">Portal Access</CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center space-y-6">
          <p className="text-zinc-500 text-sm">Sign in with your Google account to access your profile or admin dashboard.</p>
          <Button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full h-12 rounded-full font-bold"
          >
            {loading ? 'Processing...' : 'Continue with Google'}
          </Button>
          
          <div className="pt-4">
             <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Secure Authentication</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
