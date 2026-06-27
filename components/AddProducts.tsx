'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase"

interface NewProductFormProps {
  onSuccess?: (newProduct: any) => void; 
}

export default function NewProductForm({ onSuccess }: NewProductFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Templates');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [ownedBy, setOwnedBy] = useState([""]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          summary,
          price: parseFloat(price),
          category,
          imageUrl,
          downloadUrl,
        }),
      });

const data = await response.json();
      if (response.ok) {
        setTitle('');
        setDescription('');
        setPrice('');

const user = auth.currentUser;
if (!user) { router.push("/login"); return; } 

const newProduct = {
  id: data.productId,
  title,
  description,
  summary,
  price: parseFloat(price),
  category,
  imageUrl,
  downloadUrl,
  createdAt: new Date(),
  sellerId: user.uid,
  ownedBy: [user.uid], 
};


  if (onSuccess) {
    onSuccess(newProduct);
  }
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white border rounded-xl shadow-sm text-black">
      <h1 className="text-2xl font-bold mb-6">List a New Digital Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input 
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Next.js SaaS Boilerplate"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            required value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            placeholder="Describe your digital product..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea 
            required value={description} onChange={(e) => setSummary(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            placeholder="Describe your digital product..."
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input 
              type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="19.99"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="Templates">Templates</option>
              <option value="UI Kits">UI Kits</option>
              <option value="E-books">E-books</option>
              <option value="Software">Software</option>
            </select>
          </div>
            <div>
            <label className="block text-sm font-medium mb-1">Paste image URL</label>
            <input 
              type="text" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}