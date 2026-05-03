
interface SideBarSeccionProps {
  icon: React.ReactNode;
  text: string;
  children: React.ReactNode;
}

function SideBarSeccion({ icon, text, children }: SideBarSeccionProps) {
  return (
    <div className="pt-4 pb-2">
      <div className="px-6 flex justify-between items-center text-slate-800 mb-1">
        <div className="flex gap-2 items-center">
          <div className="text-slate-700 ">{icon}</div>
          <span className="text-sm text-slate-700 font-bold">{text}</span>
        </div>
        <div className="h-4 text-slate-700 rounded-full" />
      </div>

      <div className="">{children}</div>
    </div>
  );
}

export default SideBarSeccion;
