import { CircleExclamation } from "@gravity-ui/icons";
import { DCard } from "@/app/components/ui/DCard";
import { DPill } from "@/app/components/ui/DPill";
import Button from "@/app/components/ui/Button";

function CriticalAlertsCard() {

    const alerts = [
              { title: "Falla en Grúa Torre 2", sub: "Sector C · J. Méndez", time: "12 min", tone: "critical" as const },
              { title: "Faltante: hierro 12 mm", sub: "Pedido sin aprobar", time: "2 h", tone: "critical" as const },
              { title: "Demora en hormigón",    sub: "Sector B · 3 días",  time: "ayer", tone: "attention" as const },
            ] as const;
    const criticalsAlertsCounter = alerts.filter(a => a.tone === "critical").length;
    return (

    <DCard padding="p-0">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="text-[14px] font-bold">Críticos activos</div>
            <DPill tone="criticalSolid"> {criticalsAlertsCounter} </DPill>
          </div>
          <div className="divide-y divide-slate-200">
            {alerts.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center flex-none
                    ${a.tone === "critical" ? "bg-critical-50 text-[#B91C1C]" : "bg-attention-50 text-[#A16207]"}`}
                >
                  <CircleExclamation width={14} height={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold leading-tight">{a.title}</div>
                  <div className="text-[10px] text-slate-500 mt-[2px]">
                    {a.sub} · hace {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-200">
            <Button variant="secondary" size="sm" className="w-full justify-center">
              Ver todas las alertas
            </Button>
          </div>
        </DCard>
        )
}

export default CriticalAlertsCard;