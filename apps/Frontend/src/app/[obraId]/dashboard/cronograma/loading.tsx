function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-48 rounded-md" /><S className="h-4 w-64 rounded-md mt-2" /></div>
        <div className="flex gap-2"><S className="h-9 w-28 rounded-lg" /><S className="h-9 w-36 rounded-lg" /></div>
      </div>
      <div className="flex gap-2 mb-4"><S className="h-9 w-24 rounded-md" /><S className="h-9 w-52 rounded-md" /></div>
      <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-slate-200 bg-slate-50"><S className="h-7 w-16 rounded" /><S className="h-7 w-20 rounded" /><S className="h-7 w-16 rounded" /><S className="h-7 w-24 rounded" /></div>
        <div className="p-5 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <S className="h-4 w-36 rounded" />
              <S className="flex-1 h-6 rounded-full" />
              <S className="h-4 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
