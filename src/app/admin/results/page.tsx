"use client";

import { useState } from "react";

export default function AdminResultsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRecalculateAll = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to recalculate");
      }
      setMessage("✅ All points recalculated!");
    } catch (error) {
      setMessage("❌ Error recalculating points");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-gold-gradient">Manage Results</h1>
        <p className="text-blue-border">Publish match results and calculate player points</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg font-heading ${
            message.includes("✅")
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : "bg-red-500/10 text-red-400 border border-red-500/30"
          }`}
        >
          {message}
        </div>
      )}

      <div className="card-dark p-6 space-y-4">
        <button
          onClick={() => handleRecalculateAll()}
          disabled={loading}
          className="btn-gold px-6 py-3 disabled:opacity-50"
        >
          {loading ? "Recalculating..." : "Recalculate All Points"}
        </button>
        <p className="text-sm text-blue-border">
          Recalculates points for all completed matches. Use if you modified results.
        </p>
      </div>

      <div className="text-blue-border text-sm p-6 card-dark">
        <p>
          💡 <strong>Tip:</strong> Publish results one match at a time using the match edit forms.
          Points are automatically calculated when you publish.
        </p>
      </div>
    </div>
  );
}
