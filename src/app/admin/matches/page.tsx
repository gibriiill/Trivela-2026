"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  stage: string;
  group?: string;
  kickoffTime: string;
  status: string;
  _count?: { predictions: number };
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/admin/matches");
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this match?")) {
      try {
        await fetch(`/api/admin/matches/${id}`, { method: "DELETE" });
        fetchMatches();
      } catch (error) {
        console.error("Error deleting match:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-gold-gradient">Manage Matches</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-gold px-6 py-3 flex items-center gap-2"
        >
          <Plus size={20} /> Add Match
        </button>
      </div>

      {showForm && (
        <div className="card-dark p-6 space-y-4 border-t-4 border-t-gold">
          <h2 className="font-heading font-bold">Add New Match</h2>
          <p className="text-blue-border text-sm">
            Coming soon: Full match form. For now, use direct API calls or database seeding.
          </p>
          <button
            onClick={() => setShowForm(false)}
            className="btn-outline px-6 py-2 text-sm"
          >
            Close
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-blue-border">Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="card-dark p-12 text-center space-y-4">
          <p className="text-blue-border">No matches added yet</p>
          <button onClick={() => setShowForm(true)} className="btn-gold px-6 py-3 inline-block">
            Add First Match
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto card-dark">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-border bg-blue-mid">
                <th className="px-4 py-3 text-left font-heading font-bold">Match</th>
                <th className="px-4 py-3 text-left font-heading font-bold">Stage</th>
                <th className="px-4 py-3 text-left font-heading font-bold">Kickoff</th>
                <th className="px-4 py-3 text-center font-heading font-bold">Status</th>
                <th className="px-4 py-3 text-center font-heading font-bold">Predictions</th>
                <th className="px-4 py-3 text-right font-heading font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-b border-blue-border/30 hover:bg-blue-mid/20">
                  <td className="px-4 py-3 font-heading font-bold">
                    {match.teamA} vs {match.teamB}
                  </td>
                  <td className="px-4 py-3 text-blue-border text-sm">{match.stage}</td>
                  <td className="px-4 py-3 text-sm">{new Date(match.kickoffTime).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-heading font-bold px-2 py-1 rounded ${
                        match.status === "UPCOMING"
                          ? "bg-blue-accent/20 text-blue-accent"
                          : match.status === "LIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-border/20 text-blue-border"
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gold">{match._count?.predictions || 0}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button className="p-2 hover:bg-blue-mid rounded transition-colors text-blue-border hover:text-gold">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
                      className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
