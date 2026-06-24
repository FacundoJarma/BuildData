function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-48 rounded-md" /><S className="h-4 w-48 rounded-md mt-2" /></div>
        <S className="h-9 w-36 rounded-lg" />
      </div>
      <div className="flex gap-1 mb-4"><S className="h-9 w-24 rounded-t-md" /><S className="h-9 w-28 rounded-t-md" /><S className="h-9 w-32 rounded-t-md" /></div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex gap-3">
            <S className="w-10 h-10 rounded-lg flex-none" />
            <div className="flex-1 space-y-2"><S className="h-5 w-64 rounded" /><S className="h-3 w-36 rounded" /><S className="h-4 w-full rounded" /></div>
          </div>
        ))}
      </div>
    </>
  );
}
