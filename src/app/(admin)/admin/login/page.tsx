'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      if (!cleanEmail || !password) {
        throw new Error('Please enter both email and password.');
      }

      let idToken: string | null = null;

      // Authenticate against Firebase Client SDK
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        idToken = await userCredential.user.getIdToken();
      } catch (fbErr: any) {
        // Map Firebase Auth error codes to user-friendly messages
        const code = fbErr?.code || '';
        if (
          code === 'auth/invalid-credential' ||
          code === 'auth/user-not-found' ||
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-email'
        ) {
          throw new Error('Invalid authorized email or password.');
        } else if (code === 'auth/too-many-requests') {
          throw new Error('Access temporarily blocked due to too many failed attempts. Please try again later.');
        } else if (code === 'auth/network-request-failed') {
          throw new Error('Network error connecting to Firebase Authentication.');
        }
        // If client SDK failed due to any other error, pass credentials to server endpoint
      }

      // Establish secure server-side session
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idToken ? { idToken } : { email: cleanEmail, password }),
      });

      let json: any = {};
      try {
        const text = await res.text();
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }

      if (!res.ok) {
        throw new Error(json.error || `Authentication failed (${res.status}). Please check your credentials.`);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] p-8 max-w-md w-full space-y-6 shadow-xs">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#1F4D3A] text-white font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-xs">
            P
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A] font-semibold block">
            Authorized Personnel Only
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#12150F]">
            PHBL Staff Authentication
          </h1>
          <p className="text-xs text-[#595C54]">
            Sign in with your authorized Firebase administrator credentials to manage formulations, batches, and certificates.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#12150F] mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
              <Input
                required
                type="email"
                placeholder="name@phblglobals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#12150F] mb-1">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
              <Input
                required
                type="password"
                placeholder="Enter authorized password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full gap-2 font-medium"
          >
            <span>{loading ? 'Authenticating with Firebase...' : 'Sign In to Operations Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-2 text-center text-[11px] text-[#595C54] border-t border-[rgba(18,21,15,0.06)] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Firebase Authenticated · Purusottam Homeo Bikash Lab(Bonded)</span>
        </div>
      </div>
    </div>
  );
}

