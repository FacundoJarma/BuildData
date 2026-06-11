function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export function ProjectsSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-8 py-8">
      {/* Hero */}
      <div className="rounded-2xl mb-7 bg-slate-800 p-7 sm:p-9">
        <Skeleton className="h-5 w-36 rounded-full mb-4" />
        <Skeleton className="h-9 w-72 rounded-md mb-1" />
        <Skeleton className="h-4 w-56 rounded-md mb-5" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-7 w-40 rounded-full" />
        </div>
      </div>

      {/* Quick access */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex gap-3">
            <Skeleton className="w-10 h-10 rounded-md flex-none" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Obra grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-card">
            <Skeleton className="w-full h-[104px] rounded-none" />
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="w-5 h-5 rounded" />
              </div>
              <Skeleton className="h-3 w-48 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="w-[22px] h-[22px] rounded-full ring-2 ring-white" />
                  ))}
                </div>
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
