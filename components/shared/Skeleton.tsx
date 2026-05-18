'use client';

/**
 * Skeleton loading component — matches the shape of real content
 * to prevent layout shift while data loads.
 */
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/5',
        className
      )}
    />
  );
}

/** Skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white/4 border border-white/6 space-y-3">
      <Skeleton className="w-9 h-9 rounded-xl" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

/** Skeleton for a classroom card */
export function ClassroomCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/4 overflow-hidden">
      <Skeleton className="h-28 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/** Skeleton for an assignment row */
export function AssignmentRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/6">
      <Skeleton className="w-1 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/** Generic list skeleton */
export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
