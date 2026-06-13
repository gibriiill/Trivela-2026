"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setMessage(
        "If an account exists, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process request"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-dark p-8 space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl text-gold-gradient">
            Forgot Password
          </h1>
          <p className="text-blue-border text-sm mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm font-heading">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm font-heading">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-heading font-bold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark w-full"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold w-full py-3 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}