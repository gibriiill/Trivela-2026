"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getFlag, getStageLabel, cn } from "@/lib/utils";
import { MatchStage, MatchStatus, STAGE_LABELS } from "@/types";

const GROUPS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

const groupStandings: Record<string, { team: string; group: string }[]> = {
  A: [
    { team: "Mexico", group: "A" },
    { team: "South Africa", group: "A" },
    { team: "South Korea", group: "A" },
    { team: "Czechia", group: "A" },
  ],
  B: [
    { team: "Canada", group: "B" },
    { team: "Bosnia and Herzegovina", group: "B" },
    { team: "Qatar", group: "B" },
    { team: "Switzerland", group: "B" },
  ],
  C: [
    { team: "Brazil", group: "C" },
    { team: "Morocco", group: "C" },
    { team: "Haiti", group: "C" },
    { team: "Scotland", group: "C" },
  ],
  D: [
    { team: "United States", group: "D" },
    { team: "Paraguay", group: "D" },
    { team: "Australia", group: "D" },
    { team: "Türkiye", group: "D" },
  ],
  E: [
    { team: "Germany", group: "E" },
    { team: "Curaçao", group: "E" },
    { team: "Ivory Coast", group: "E" },
    { team: "Ecuador", group: "E" },
  ],
  F: [
    { team: "Netherlands", group: "F" },
    { team: "Japan", group: "F" },
    { team: "Sweden", group: "F" },
    { team: "Tunisia", group: "F" },
  ],
  G: [
    { team: "Belgium", group: "G" },
    { team: "Egypt", group: "G" },
    { team: "Iran", group: "G" },
    { team: "New Zealand", group: "G" },
  ],
  H: [
    { team: "Spain", group: "H" },
    { team: "Cape Verde", group: "H" },
    { team: "Saudi Arabia", group: "H" },
    { team: "Uruguay", group: "H" },
  ],
  I: [
    { team: "France", group: "I" },
    { team: "Senegal", group: "I" },
    { team: "Iraq", group: "I" },
    { team: "Norway", group: "I" },
  ],
  J: [
    { team: "Argentina", group: "J" },
    { team: "Algeria", group: "J" },
    { team: "Austria", group: "J" },
    { team: "Jordan", group: "J" },
  ],
  K: [
    { team: "Portugal", group: "K" },
    { team: "DR Congo", group: "K" },
    { team: "Uzbekistan", group: "K" },
    { team: "Colombia", group: "K" },
  ],
  L: [
    { team: "England", group: "L" },
    { team: "Croatia", group: "L" },
    { team: "Ghana", group: "L" },
    { team: "Panama", group: "L" },
  ],
};

const emptyForm = {
  teamA: "",
  teamB: "",
  group: "",
  stage: "GROUP" as MatchStage,
  venue: "",
  kickoffTime: "",
  status: "UPCOMING" as MatchStatus,
};

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  group?: string;
  stage: MatchStage;
  venue?: string;
  kickoffTime: string;
  status: MatchStatus;
  _count?: { predictions: number };
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 3000);
  };

  const currentGroupTeams =
    form.group && groupStandings[form.group]
      ? groupStandings[form.group]
      : [];

  const STAGES = Object.keys(STAGE_LABELS) as MatchStage[];

  const fetchMatches = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchMatches();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (match: Match) => {
    setEditingId(match.id);
    setForm({
      teamA: match.teamA,
      teamB: match.teamB,
      group: match.group || "",
      stage: match.stage,
      venue: match.venue || "",
      kickoffTime: new Date(match.kickoffTime).toISOString().slice(0, 16),
      status: match.status,
    });
    setShowForm(true);
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value } as typeof prev;

      if (name === "group") {
        const selectedGroup = groupStandings[value] ?? [];
        if (selectedGroup.length >= 2) {
          next.teamA = selectedGroup[0].team;
          next.teamB = selectedGroup[1].team;
        }
      }

      if (name === "stage" && value === "GROUP" && !prev.group) {
        next.group = "A";
        next.teamA = groupStandings.A[0].team;
        next.teamB = groupStandings.A[1].team;
      }

      return next;
    });
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    if (!form.teamA || !form.teamB || !form.kickoffTime) {
      showToast("error", "Team names and kickoff time are required.");
      setSaving(false);
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/matches/${editingId}`
        : "/api/admin/matches";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          group: form.group || undefined,
          venue: form.venue || undefined,
          kickoffTime: new Date(form.kickoffTime).toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        showToast("error", data?.error || "Failed to save match.");
        return;
      }

      showToast("success", editingId ? "Match updated!" : "Match added!");
      setShowForm(false);
      fetchMatches();
    } catch (error) {
      console.error("Save match error:", error);
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this match and all its predictions?")) return;
    setDeleting(id);

    try {
      const response = await fetch(`/api/admin/matches/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showToast("error", "Failed to delete match");
        return;
      }

      showToast("success", "Match deleted");
      fetchMatches();
    } catch (error) {
      console.error("Delete match error:", error);
      showToast("error", "Network error");
    } finally {
      setDeleting(null);
    }
  };

  const statusColors: Record<MatchStatus, string> = {
    UPCOMING: "text-white/50 bg-white/5",
    LIVE: "text-green-400 bg-green-400/10",
    COMPLETED: "text-[#F0B429] bg-[#F0B429]/10",
  };

  return (
    <div className="relative">
      {toast && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl font-heading text-sm font-semibold animate-fade-in",
            toast.type === "success"
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-white">MATCHES</h1>
          <p className="font-heading text-white/40 text-sm mt-0.5">
            {matches.length} matches total
          </p>
        </div>

        <button
          onClick={openAdd}
          className="btn-gold px-4 py-2.5 rounded-xl font-heading font-bold text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Match
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: "rgba(5,14,31,0.95)" }}
        >
          <div className="card-dark w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#1A2F55]">
              <h2 className="font-display text-xl text-white">
                {editingId ? "EDIT MATCH" : "ADD MATCH"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                    Team A (Home)
                  </label>
                  <select
                    value={form.teamA}
                    onChange={(e) => setForm({ ...form, teamA: e.target.value })}
                    required
                    className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                  >
                    <option value="">Select team</option>
                    {Object.values(groupStandings).flat().map((team) => (
                      <option key={`${team.group}-${team.team}`} value={team.team}>
                        {getFlag(team.team)} {team.team}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                    Team B (Away)
                  </label>
                  <select
                    value={form.teamB}
                    onChange={(e) => setForm({ ...form, teamB: e.target.value })}
                    required
                    className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                  >
                    <option value="">Select team</option>
                    {Object.values(groupStandings).flat().map((team) => (
                      <option key={`${team.group}-${team.team}`} value={team.team}>
                        {getFlag(team.team)} {team.team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                    Stage
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) =>
                      setForm({ ...form, stage: e.target.value as MatchStage })
                    }
                    className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {STAGE_LABELS[stage]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                    Group
                  </label>
                  <select
                    value={form.group}
                    onChange={(e) =>
                      setForm((prev) => {
                        const next = { ...prev, group: e.target.value };
                        const teams =
                          groupStandings[e.target.value as keyof typeof groupStandings] || [];

                        if (teams.length >= 2) {
                          next.teamA = teams[0].team;
                          next.teamB = teams[1].team;
                        }

                        return next;
                      })
                    }
                    className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                  >
                    <option value="">None</option>
                    {GROUPS.map((group) => (
                      <option key={group} value={group}>
                        Group {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                  Kickoff Time
                </label>
                <input
                  type="datetime-local"
                  value={form.kickoffTime}
                  onChange={(e) => setForm({ ...form, kickoffTime: e.target.value })}
                  required
                  className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                />
              </div>

              <div>
                <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                  Venue (optional)
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="e.g. MetLife Stadium, New Jersey"
                  className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                />
              </div>

              {editingId && (
                <div>
                  <label className="block font-heading font-semibold text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as MatchStatus })
                    }
                    className="input-dark w-full px-3 py-2.5 rounded-lg font-heading text-sm"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-[#1A2F55] font-heading font-semibold text-sm text-white/60 hover:text-white hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-gold py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving..." : editingId ? "Update Match" : "Add Match"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#F0B429]" />
        </div>
      ) : matches.length === 0 ? (
        <div className="card-dark py-20 text-center">
          <Calendar size={48} className="text-white/10 mx-auto mb-4" />
          <p className="font-heading text-white/30 text-lg">No matches yet.</p>
          <button
            onClick={openAdd}
            className="btn-gold mt-4 px-6 py-2.5 rounded-xl font-heading font-bold text-sm"
          >
            Add First Match
          </button>
        </div>
      ) : (
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A2F55]">
                  {[
                    "Match",
                    "Stage/Group",
                    "Kickoff",
                    "Status",
                    "Predictions",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-heading font-semibold text-xs text-white/40 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr
                    key={match.id}
                    className="border-b border-[#1A2F55]/50 last:border-0 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-heading font-semibold text-sm text-white">
                        {getFlag(match.teamA)} {match.teamA}{" "}
                        <span className="text-white/30">vs</span> {" "}
                        {getFlag(match.teamB)} {match.teamB}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-heading text-sm text-white/60">
                        {getStageLabel(match.stage)}
                      </div>
                      {match.group && (
                        <div className="font-heading text-xs text-white/30">
                          Group {match.group}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-heading text-sm text-white/60 whitespace-nowrap">
                      {new Date(match.kickoffTime).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-heading font-semibold",
                          statusColors[match.status]
                        )}
                      >
                        {match.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-heading text-sm text-white/50 text-center">
                      {match._count?.predictions || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(match)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-[#F0B429] hover:bg-[#F0B429]/10 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(match.id)}
                          disabled={deleting === match.id}
                          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-30"
                        >
                          {deleting === match.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
