
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { authClient } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(authClient, email.trim());
      router.push("/login?reset=sent");
    } catch (err: any) {
      console.error("Failed to send reset email:", err);

      if (err.code === "auth/user-not-found") {
        router.push("/login?reset=sent");
        return;
      }

      if (err.code === "auth/invalid-email") {
        setError("Enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white border rounded-xl shadow-sm text-black">
      <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter the email on your account and we'll send you a link to reset your password.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        <a href="/login" className="text-blue-600 hover:underline">
          Back to login
        </a>
      </p>
    </div>
  );
}