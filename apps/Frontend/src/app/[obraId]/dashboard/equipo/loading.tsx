function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-40 rounded-md" /><S className="h-4 w-64 rounded-md mt-2" /></div>
      </div>
      <S className="h-4 w-36 rounded mb-3" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-5"><S className="w-11 h-11 rounded-full mb-3" /><S className="h-5 w-28 rounded mb-1" /><S className="h-3 w-20 rounded mb-3" /><div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200"><div><S className="h-3 w-12 rounded mb-1" /><S className="h-6 w-10 rounded" /></div><div><S className="h-3 w-12 rounded mb-1" /><S className="h-6 w-10 rounded" /></div></div></div>
        ))}
      </div>
      <S className="h-4 w-48 rounded mb-3" />
      <div className="bg-white border border-slate-200 rounded-lg p-5"><div className="divide-y divide-slate-100">{[1, 2].map((i) => <div key={i} className="flex items-center gap-3 py-3"><S className="w-9 h-9 rounded-full" /><div className="flex-1"><S className="h-4 w-28 rounded" /><S className="h-3 w-36 rounded mt-1" /></div></div>)}</div></div>
    </>
  );
}
