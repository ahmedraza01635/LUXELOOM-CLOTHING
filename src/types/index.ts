export type Category = 'Essentials' | 'Accessories' | 'Footwear' | 'Streetwear';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  stock: number;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  displayName?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
