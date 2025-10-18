/**
 * Skeleton Components
 * Loading placeholders
 */

export function SkeletonCard() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 animate-pulse">
      <div className="h-48 bg-neutral-200 rounded mb-4" />
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-neutral-200 rounded w-1/2" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-neutral-200 rounded"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
