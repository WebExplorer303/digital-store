import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import Review from '@/components/review'
import { Product } from "@/types/product";
import ProductAside from "@/components/product-card";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div className="text-stone-400 p-10">Product not found</div>;
  }

  const raw = docSnap.data()!;

  const product = {
    id: docSnap.id,
    title: raw.title,
    description: raw.description,
    summary: raw.summary,
    price: raw.price,
    imageUrl: raw.imageUrl,
    downloadUrl: raw.downloadUrl,
    category: raw.category,
    sellerId: raw.sellerId,
    ownedBy: raw.ownedBy ?? [],
  } as Product;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 sm:gap-10 lg:gap-16 items-start">
        <section className="w-full order-2 lg:order-1">
          <div className="border border-stone-800 bg-stone-900 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2 tracking-tight">
              {product.title}
            </h1>
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 mb-5 sm:mb-8">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-auto max-h-[260px] sm:max-h-[420px] object-cover"
            />
          </div>

          <div className="border border-stone-800 bg-stone-900 rounded-2xl p-4 sm:p-6 mb-2">
            <h2 className="text-sm uppercase tracking-widest font-semibold text-stone-500 mb-3 sm:mb-4">
              Description
            </h2>
            <div className="text-stone-400 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {product.description}
            </div>
          </div>

          <div className="border border-stone-700 bg-stone-700 rounded-2xl p-4 sm:p-6">
            <Review productId={product.id} />
          </div>
        </section>

        <ProductAside product={product} />
      </div>
    </main>
  );
}