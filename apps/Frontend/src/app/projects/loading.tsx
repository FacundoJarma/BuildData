import { ProjectsSkeleton } from "./_components/ProjectsSkeleton";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function ProjectsLoading() {
  return (
    <div className="obras-root flex bg-paper overflow-hidden" style={{ height: "100vh" }}>
      {/* Sidebar skeleton */}
      <aside className="w-[240px] flex flex-col flex-none bg-slate-950">
        <div className="px-4 py-4 flex items-center gap-[10px]">
          <Skeleton className="w-7 h-7 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="flex-1 px-3 py-2 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-lg" />
          ))}
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar skeleton */}
        <div className="h-14 border-b border-slate-200 flex items-center px-6 gap-3">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <main className="flex-1 overflow-y-auto">
          <ProjectsSkeleton />
        </main>
      </div>
    </div>
  );
}
