import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, authAdmin } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);

    const body = await request.json();

    const { productId, comment, rating } = body; 

    if (!comment || !rating || !productId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const docRef = await dbAdmin.collection("reviews").add({
      productId,
      userEmail: decodedClaims.email,                 
      userName: decodedClaims.name || "Anonymous",    
      userId: decodedClaims.uid,                       
      rating,
      comment,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, message: "Review submitted" }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId query param is required." },
        { status: 400 }
      );
    }

    const snapshot = await dbAdmin
      .collection("reviews")
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc")
      .get();

    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
      };
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}