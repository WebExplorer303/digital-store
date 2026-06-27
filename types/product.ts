export interface Product {
  id: string;
  title: string;
  description: string;
  summary?: string;
  price: number;
  imageUrl: string;
  category?: string;
  sellerId?: string;
  downloadUrl?: string;
  ownedBy?: string[];
}

