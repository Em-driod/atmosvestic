export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Adire fabrics' | 'Ankara fabrics' | 'Ready-to-Wear' | 'Asoebi collections';
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  address: string;
  email: string;
  saveDetails: boolean;
}
