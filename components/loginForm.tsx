"use client";
import { useState } from "react";  
import { signInWithEmailAndPassword } from "firebase/auth";
import { authClient } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginForm({ onClose }: { onClose?: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const userCredentials = await signInWithEmailAndPassword(authClient, email, password);
    const idToken = await userCredentials.user.getIdToken();
    
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) throw new Error('Could not initialize secure session.');

    window.location.href = "/";

  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Invalid username or password.');
  } finally {
    setLoading(false);
  }
};

return (
  <div style={{ width: '100%', maxWidth: '400px', background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '2rem', position: 'relative' }}>
    
  
<button
  onClick={() => onClose ? onClose() : router.push("/")}
  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '18px', color: '#999', cursor: 'pointer' }}
>
  ✕
</button>

    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f5f5', border: '0.5px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        👜
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 4px', color: '#111' }}>Welcome</h2>
      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Sign in to your marketplace account</p>
    </div>

    {error && (
      <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 12px', marginBottom: '1rem', fontSize: '13px', color: '#b91c1c' }}>
        {error}
      </div>
    )}

    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '6px' }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          disabled={loading}
          style={{ width: '100%', padding: '9px 12px', fontSize: '14px', border: '0.5px solid #d4d4d4', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111' }}
        />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#555' }}>Password</label>
          <a href="/forgot-password" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>Forgot password?</a>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          disabled={loading}
          style={{ width: '100%', padding: '9px 12px', fontSize: '14px', border: '0.5px solid #d4d4d4', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ width: '100%', padding: '10px', marginTop: '4px', background: loading ? '#9ca3af' : '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', margin: 0 }}>
        Don't have an account?{' '}
        <a href="/sign-up" style={{ color: '#2563eb', textDecoration: 'none' }}>Create one</a>
      </p>
    </form>
  </div>
);
}