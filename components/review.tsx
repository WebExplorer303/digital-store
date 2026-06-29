"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { authClient } from "@/lib/firebase";

type Review = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string | null;
};

type ReviewProps = {
  productId: string;
};

export default function Review({ productId }: ReviewProps) {
  const [user] = useAuthState(authClient);
  const currentUserId = user?.uid ?? null;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadReviews() {
      setIsLoadingReviews(true);
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = await res.json();
        if (!isCancelled) setReviews(data.reviews ?? []);
      } catch {
        if (!isCancelled) setError("Couldn't load reviews. Try refreshing.");
      } finally {
        if (!isCancelled) setIsLoadingReviews(false);
      }
    }

    loadReviews();
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (rating === 0) {
      setError("Pick a star rating before submitting.");
      return;
    }
    if (comment.trim().length === 0) {
      setError("Write a few words about your experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setReviews((prev) => [
        {
          id: data.id,
          userId: currentUserId ?? "",
          userName: data.userName ?? "You",
          rating,
          comment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setRating(0);
      setComment("");
      setSuccessMessage("Review submitted. Thanks for the feedback.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(review: Review) {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
    setEditError(null);
  }

  async function handleSaveEdit(id: string) {
    setEditError(null);

    if (editRating === 0) {
      setEditError("Pick a star rating.");
      return;
    }
    if (editComment.trim().length === 0) {
      setEditError("Review can't be empty.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update review");
      }

      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, rating: editRating, comment: editComment, updatedAt: data.updatedAt }
            : r
        )
      );
      cancelEdit();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSavingEdit(false);
    }
  }
  return (
    <section className="w-full space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-sm uppercase tracking-widest font-semibold text-white-500">
          Write a review
        </h2>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded"
            >
              <span className={`text-2xl ${star <= (hoverRating || rating) ? "text-amber-400" : "text-stone-500"}`}>
                <span className="drop-shadow-sm">★</span>
              </span>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-xs text-stone-500">{rating} of 5</span>
          )}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think?"
          rows={3}
          className="w-full resize-none rounded-xl border border-stone-800 bg-stone-700 p-3 text-sm text-white-200 placeholder:text-white-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {successMessage && <p className="text-sm text-emerald-400">{successMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-500"
        >
          {isSubmitting ? "Submitting…" : "Submit review"}
        </button>
      </form>

      <div className="space-y-4 border-t border-stone-800 pt-8">
        <h2 className="text-sm uppercase tracking-widest font-semibold text-stone-500">
          {reviews.length > 0
            ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}`
            : "Reviews"}
        </h2>

        {isLoadingReviews && <p className="text-sm text-stone-500">Loading reviews…</p>}

        {!isLoadingReviews && reviews.length === 0 && (
          <p className="text-sm text-stone-500">No reviews yet. Be the first to write one.</p>
        )}

        <ul className="space-y-4">
          {reviews.map((review) =>
            editingId === review.id ? (
              <li
                key={review.id}
                className="space-y-3 rounded-xl border border-stone-800 bg-stone-950 p-4"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => setEditRating(star)}
                      onMouseEnter={() => setEditHoverRating(star)}
                      onMouseLeave={() => setEditHoverRating(0)}
                      className="p-0.5 text-xl leading-none transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded"
                    >
                      <span className={star <= (editHoverRating || editRating) ? "text-amber-400" : "text-stone-700"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>

                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-stone-800 bg-stone-900 p-2 text-sm text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                />

                {editError && <p className="text-sm text-red-400">{editError}</p>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(review.id)}
                    disabled={isSavingEdit}
                    className="rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-500"
                  >
                    {isSavingEdit ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isSavingEdit}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-400 transition-colors hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li key={review.id} className="border-b border-stone-800 pb-4 last:border-none">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{review.userName}</span>
                  <span className="text-xs text-stone-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                    {review.updatedAt && " · edited"}
                  </span>
                </div>
                <div className="mt-1 text-amber-400">
                  {"★".repeat(review.rating)}
                  <span className="text-stone-700">{"★".repeat(5 - review.rating)}</span>
                </div>
                <p className="mt-1 text-sm text-stone-400">{review.comment}</p>

                {currentUserId && review.userId === currentUserId && (
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="mt-1 text-xs font-medium text-stone-500 underline-offset-2 hover:text-amber-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  );
}