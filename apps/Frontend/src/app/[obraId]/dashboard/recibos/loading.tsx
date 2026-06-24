function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-48 rounded-md" /><S className="h-4 w-56 rounded-md mt-2" /></div>
        <S className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4"><S className="w-9 h-9 rounded-lg mb-3" /><S className="h-8 w-24 rounded mb-1" /><S className="h-3 w-16 rounded" /></div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200"><S className="h-5 w-32 rounded" /></div>
        <div className="divide-y divide-slate-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4"><S className="w-7 h-9 rounded flex-none" /><S className="h-4 w-48 rounded" /><S className="h-4 w-24 rounded" /><S className="h-4 w-20 rounded" /><S className="h-4 w-28 rounded ml-auto" /></div>
          ))}
        </div>
      </div>
    </>
  );
}
