import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, authAdmin } from "@/lib/firebaseAdmin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const sessionCookie = request.cookies.get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);

    const body = await request.json();
    const { comment, rating } = body;

    if (!comment || !rating) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const reviewRef = dbAdmin.collection("reviews").doc(id);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    const existingReview = reviewSnap.data();

    if (existingReview?.userId !== decodedClaims.uid) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const updatedAt = new Date();
    await reviewRef.update({ comment, rating, updatedAt });

    return NextResponse.json(
      { id, comment, rating, updatedAt: updatedAt.toISOString(), message: "Review updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Failed to update review." }, { status: 500 });
  }
}