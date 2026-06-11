"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg", className)} />;
}

export function MatchCardSkeleton() {
  return (
    <div className="card-dark p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Skeleton className="h-8 w-32 mb-2" />
        </div>
        <Skeleton className="h-8 w-16" />
        <div className="flex-1 text-right">
          <Skeleton className="h-8 w-32 ml-auto" />
        </div>
      </div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
