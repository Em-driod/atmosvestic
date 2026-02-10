import { Product } from './types';

// Hero Assets
export const HERO_IMAGE = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2576&auto=format&fit=crop";
// High-quality cinematic fabric movement video
export const HERO_VIDEO = "https://player.vimeo.com/external/494252666.hd.mp4?s=2f5ef451239589577172ca3148ef7397ba9183a5&profile_id=175";

export const COLLECTIONS = [
  {
    id: 'indigo',
    title: 'INDIGO DREAMS',
    subtitle: 'Classic Adire',
    image: "/one.jpeg", // Indigo tie dye pattern
  },
  {
    id: 'earth',
    title: 'EARTH & CLAY',
    subtitle: 'Modern Kampala',
    image: "/two.jpeg", // Warm african print
  },
  {
    id: 'heritage',
    title: 'HERITAGE',
    subtitle: 'Ceremonial Robes',
    image: "/three.jpeg", // Woman in headwrap
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Adire Boubou',
    price: 45000,
    category: 'Ready-to-Wear',
    image: "/eight.jpeg",
    description: "Flowing silk silhouette hand-dyed in deep indigo traditions."
  },
  {
    id: '2',
    name: 'Hand-Dyed Adire Silk',
    price: 25000,
    category: 'Adire fabrics',
    image: "/four.jpeg",
    description: "Premium hand-dyed Adire fabric with intricate resist patterns."
  },
  {
    id: '3',
    name: 'Vibrant Ankara Print',
    price: 15000,
    category: 'Ankara fabrics',
    image: "/five.jpeg",
    description: "High-quality 100% cotton Ankara fabric with bold African prints."
  },
  {
    id: '4',
    name: 'Luxury Asoebi Lace',
    price: 65000,
    category: 'Asoebi collections',
    image: "/six.jpeg",
    description: "Exquisite lace fabric curated for special occasions and weddings."
  },
  {
    id: '5',
    name: 'Casual Ankara Wrap',
    price: 22000,
    category: 'Ready-to-Wear',
    image: "/seven.jpeg",
    description: "Modern Ankara wrap top for everyday elegance."
  },
  {
    id: '6',
    name: 'Ceremonial Adire Gown',
    price: 55000,
    category: 'Ready-to-Wear',
    image: "/eight.jpeg",
    description: "Stunning Adire gown designed for parties and special events."
  },
  {
    id: '7',
    name: 'Classic Indigo Yardage',
    price: 20000,
    category: 'Adire fabrics',
    image: "/ten.jpeg",
    description: "Traditional indigo-dyed fabric for bespoke tailoring."
  },
  {
    id: '8',
    name: 'Premier Asoebi Set',
    price: 120000,
    category: 'Asoebi collections',
    image: "/seven.jpeg",
    description: "Full Asoebi collection set including headgear and matching accessories."
  }
];