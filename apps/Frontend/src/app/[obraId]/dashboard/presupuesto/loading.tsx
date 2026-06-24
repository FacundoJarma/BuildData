function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-36 rounded-md" /><S className="h-4 w-48 rounded-md mt-2" /></div>
        <div className="flex gap-2"><S className="h-9 w-24 rounded-lg" /><S className="h-9 w-28 rounded-lg" /><S className="h-9 w-28 rounded-lg" /></div>
      </div>
      <div className="grid grid-cols-[260px_1fr] gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5"><S className="w-[150px] h-[150px] rounded-full mx-auto mb-4" /><S className="h-4 w-24 mx-auto rounded" /></div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4"><S className="w-9 h-9 rounded-lg mb-3" /><S className="h-7 w-28 rounded mb-1" /><S className="h-3 w-20 rounded" /></div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4"><S className="h-5 w-32 rounded mb-3" /><S className="h-4 w-64 rounded mb-2" /><S className="h-4 w-56 rounded" /></div>
    </>
  );
}
