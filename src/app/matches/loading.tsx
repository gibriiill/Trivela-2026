import { MatchCardSkeleton } from "@/components/ui/Skeleton";

export default function MatchesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <div className="h-10 bg-shimmer rounded-lg w-40" />
        <div className="h-4 bg-shimmer rounded-lg w-60" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
