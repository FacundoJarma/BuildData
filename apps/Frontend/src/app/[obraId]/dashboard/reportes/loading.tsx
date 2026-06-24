function S({ className = '' }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div><S className="h-7 w-36 rounded-md" /><S className="h-4 w-64 rounded-md mt-2" /></div>
        <S className="h-9 w-40 rounded-lg" />
      </div>
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="blueprint-bg p-7"><S className="h-6 w-48 rounded mb-2" /><S className="h-4 w-64 rounded mb-4" /><S className="h-8 w-72 rounded mb-2" /><div className="grid grid-cols-4 gap-4 mt-6">{[1, 2, 3, 4].map((i) => <div key={i}><S className="h-6 w-16 rounded mb-1" /><S className="h-3 w-12 rounded" /></div>)}</div></div>
          <div className="p-5 space-y-3">{[1, 2, 3, 4, 5].map((i) => <S key={i} className="h-10 w-full rounded" />)}</div>
        </div>
        <div className="space-y-4"><div className="bg-white border border-slate-200 rounded-lg p-4"><S className="h-5 w-20 rounded mb-3" /><div className="grid grid-cols-2 gap-2">{[1, 2, 3, 4].map((i) => <S key={i} className="h-10 w-full rounded" />)}</div></div></div>
      </div>
    </>
  );
}
