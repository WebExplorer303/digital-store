"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";
import  { useRouter }  from 'next/navigation'

interface EditProductProps {
    productId: string;
}

export default function EditProduct({ productId }: EditProductProps) {
      const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState('');
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Templates");
  const [imageUrl, setImageUrl] = useState("")
    const [loading, setLoading] = useState(false); 
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

const router = useRouter();

useEffect(() => {
    if(!productId) return ;

    async function fetchProduct()
    {
        setFetching(true);
        setError("");
        setNotFound(false);

       try{
        const ref = doc(db,"products",productId);
        const snap = await getDoc(ref);

   
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }

        const data = snap.data();
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setSummary(data.summary ?? ""); 
        setPrice(data.price != null ? String(data.price) : "");
        setCategory(data.category ?? "Templates");
        setImageUrl(data.imageUrl ?? "");
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Couldn't load this product. Try refreshing the page.");
      } finally {
        setFetching(false);
      }
    }

    fetchProduct();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const ref = doc(db, "products", productId);
      await updateDoc(ref, {
        title: title.trim(),
        description: description.trim(),
        summary:summary.trim(),
        price: parseFloat(price),
        category,
        imageUrl: imageUrl.trim(),
        updatedAt: new Date(),
      });

      router.push("/manage");
    } catch (err) {
      console.error("Failed to update product:", err);
      setError("Something went wrong saving your changes. Please try again.");
    } finally {
      setLoading(false);
    }
  }
if (fetching) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl shadow-sm text-black">
        <p className="text-sm text-gray-500">Loading product…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl shadow-sm text-black">
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-sm text-gray-500">
          This product may have been deleted, or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white border rounded-xl shadow-sm text-black">
      <h1 className="text-2xl font-bold mb-6">Edit Digital Asset</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Next.js SaaS Boilerplate"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            placeholder="Describe your digital product..."
            disabled={loading}
          />
        </div>

              <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea 
            required value={summary} 
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            placeholder="Describe your digital product..."
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="19.99"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}