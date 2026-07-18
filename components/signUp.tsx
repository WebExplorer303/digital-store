"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { authClient } from '@/lib/firebase';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(authClient, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error('Could not initialize secure session.');

      window.location.href = '/';
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError(err.message || 'An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f3' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '2rem' }}>

        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f5f5', border: '0.5px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 4px', color: '#111' }}>Create an account</h2>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Start selling your digital assets today</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 12px', marginBottom: '1rem', fontSize: '13px', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '6px' }}>
              Password
            </label>
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

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '6px' }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', margin: 0 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}