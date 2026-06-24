function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-40 rounded-md" /><S className="h-4 w-48 rounded-md mt-2" /></div>
        <div className="flex gap-2"><S className="h-9 w-36 rounded-lg" /><S className="h-9 w-40 rounded-lg" /></div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4"><S className="w-9 h-9 rounded-lg mb-3" /><S className="h-8 w-16 rounded mb-1" /><S className="h-3 w-20 rounded" /></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4"><S className="h-5 w-40 rounded mb-2" /><S className="h-3 w-28 rounded mb-3" /><S className="h-8 w-20 rounded mb-1" /><S className="h-2 w-full rounded" /></div>
        ))}
      </div>
    </>
  );
}
