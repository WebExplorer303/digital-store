import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, authAdmin } from "@/lib/firebaseAdmin";
 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("DELETE hit for id:", id);

  try {
    const sessionCookie = request.cookies.get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const cartRef = dbAdmin.collection("carts").doc(decodedClaims.uid);
    const cartSnap = await cartRef.get();

    if (!cartSnap.exists) {
      return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    }

    const existingItems = cartSnap.data()?.items ?? [];
    const updatedItems = existingItems.filter(
      (item: { productId: string }) => item.productId !== id
    );

    await cartRef.set({ items: updatedItems }, { merge: true });

    return NextResponse.json({ message: "Removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json({ error: "Failed to remove from cart." }, { status: 500 });
  }
}