import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, authAdmin } from "@/lib/firebaseAdmin";
 
type CartItem = {
  productId: string;
  addedAt: Date;
};
 
async function getVerifiedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session")?.value;
  if (!sessionCookie) return null;
 
  try {
    return await authAdmin.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}
 
export async function GET(request: NextRequest) {
  try {
    const decodedClaims = await getVerifiedUser(request);
    if (!decodedClaims) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }
 
    const cartRef = dbAdmin.collection("carts").doc(decodedClaims.uid);
    const cartSnap = await cartRef.get();
 
    const items: CartItem[] = cartSnap.exists ? cartSnap.data()?.items ?? [] : [];
 
    if (items.length === 0) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }
 

    const productSnaps = await Promise.all(
      items.map((item) => dbAdmin.collection("products").doc(item.productId).get())
    );
 
    const cartWithProducts = items
      .map((item, i) => {
        const productSnap = productSnaps[i];
        if (!productSnap.exists) return null;
 
        const productData = productSnap.data();
        return {
          productId: item.productId,
          addedAt:
            item.addedAt instanceof Date
              ? item.addedAt.toISOString()
              : (item.addedAt as any)?.toDate?.().toISOString() ?? null,
          title: productData?.title,
          price: productData?.price,
          imageUrl: productData?.imageUrl,
        };
      })
      .filter(Boolean);
 
    return NextResponse.json({ items: cartWithProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart." }, { status: 500 });
  }
}
 
export async function POST(request: NextRequest) {
  try {
    const decodedClaims = await getVerifiedUser(request);
    if (!decodedClaims) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }
 
    const body = await request.json();
    const { productId } = body;
 
    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 });
    }
 
    const productSnap = await dbAdmin.collection("products").doc(productId).get();
    if (!productSnap.exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
 
    const cartRef = dbAdmin.collection("carts").doc(decodedClaims.uid);
    const cartSnap = await cartRef.get();
 
    const existingItems: CartItem[] = cartSnap.exists ? cartSnap.data()?.items ?? [] : [];
 
    const alreadyInCart = existingItems.some((item) => item.productId === productId);
 
    if (!alreadyInCart) {
      const updatedItems = [...existingItems, { productId, addedAt: new Date() }];
      await cartRef.set({ items: updatedItems }, { merge: true });
    }
 
    return NextResponse.json({ message: "Added to cart" }, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart." }, { status: 500 });
  }
}
 