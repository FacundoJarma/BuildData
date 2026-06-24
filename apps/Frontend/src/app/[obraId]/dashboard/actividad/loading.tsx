function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-48 rounded-md" /><S className="h-4 w-64 rounded-md mt-2" /></div>
        <div className="flex gap-2"><S className="h-9 w-32 rounded-lg" /><S className="h-9 w-36 rounded-lg" /></div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}><S className="h-4 w-16 rounded mb-2" /><div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">{[1, 2, 3].map((j) => (
              <div key={j} className="p-4 flex gap-3"><S className="w-9 h-9 rounded-full flex-none" /><div className="flex-1 space-y-1"><S className="h-4 w-48 rounded" /><S className="h-3 w-full rounded" /></div></div>
            ))}</div></div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4"><S className="h-5 w-40 rounded mb-3" />{[1, 2, 3].map((j) => <S key={j} className="h-12 w-full rounded mb-2" />)}</div>
      </div>
    </>
  );
}
