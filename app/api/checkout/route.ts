import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, authAdmin } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const cartRef = dbAdmin.collection("carts").doc(uid);
    const cartSnap = await cartRef.get();
    const items = cartSnap.exists ? cartSnap.data()?.items ?? [] : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const batch = dbAdmin.batch();
    for (const item of items) {
      const productRef = dbAdmin.collection("products").doc(item.productId);
      batch.update(productRef, {
        ownedBy: FieldValue.arrayUnion(uid),
      });
    }
    batch.set(cartRef, { items: [] }, { merge: true });
    await batch.commit();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Failed to place order." }, { status: 500 });
  }
}