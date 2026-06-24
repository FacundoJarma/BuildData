"use client";

import { useEffect } from "react";
import { Xmark, Clock, Check, Car, Pencil, TriangleExclamation } from "@gravity-ui/icons";
import { DCard } from "@/components/ui/DCard";
import { DPill } from "@/components/ui/DPill";
import DButton from "@/components/ui/Button";
import type { PedidoItem } from "../data";

type STATE = Record<string, { tone: string; label: string; dot: string; icon: string; step: number }>;

interface Props {
  order: PedidoItem;
  STATE: STATE;
  fmt: (n: number) => string;
  onClose: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
  onDeliver?: () => void;
}

const STEP_ICONS: Record<number, typeof Check> = {
  0: Pencil,
  1: Clock,
  2: Check,
  3: Car,
  4: Check,
};

const STEP_LABELS = ["Borrador", "Por aprobar", "Aprobado", "En camino", "Entregado"];

export function OrderDrawer({ order, STATE, fmt, onClose, onApprove, onCancel, onDeliver }: Props) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const st = STATE[order.state] || STATE.draft;
  const isDelivered = order.state === "delivered";
  const isCancelled = order.state === "cancelled";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[55] bg-slate-950/40 backdrop-blur-[2px] animate-fade-task" />
      <aside className="fixed right-0 top-0 bottom-0 z-[60] w-[440px] max-w-[calc(100vw-32px)] bg-white border-l border-slate-200 shadow-big flex flex-col animate-slide-task overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3 flex-none">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full flex-none" style={{ background: st.dot }} />
              <span className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate-600">{order.id}</span>
              {order.urgent && <DPill tone="criticalSolid">Urgente</DPill>}
            </div>
            <h3 className="text-[18px] font-extrabold display-tight text-slate-950 leading-tight">{order.mat}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-950 flex items-center justify-center flex-none">
            <Xmark width={16} height={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div className="flex items-center gap-1">
            {STEP_LABELS.map((label, i) => {
              const active = i <= st.step;
              const Icon = STEP_ICONS[i] || Check;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={"w-7 h-7 rounded-full flex items-center justify-center flex-none " + (active ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
                    <Icon width={12} height={12} />
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={"h-[2px] flex-1 mx-1 " + (active && i < st.step ? "bg-primary" : "bg-slate-200")} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between px-1">
            {STEP_LABELS.map((label, i) => (
              <span key={i} className={"text-[9px] font-bold tracking-[0.04em] uppercase " + (i <= st.step ? "text-slate-950" : "text-slate-400")}
                style={{ width: i === 0 || i === STEP_LABELS.length - 1 ? "auto" : undefined }}>
                {label}
              </span>
            ))}
          </div>

          <DCard padding="p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
              <InfoRow label="Proveedor" value={order.prov} />
              <InfoRow label="Categoría" value={order.cat} />
              <InfoRow label="Cantidad" value={order.qty} />
              <InfoRow label="Precio unit." value={order.unit} />
              <InfoRow label="Total" value={fmt(order.total)} bold />
              <InfoRow label="Solicitó" value={order.who} />
              <InfoRow label="Pedido" value={order.ordered} />
              <InfoRow label="Llegada estimada" value={order.date} />
            </div>
          </DCard>

          {isDelivered && order.delivery && (
            <DCard padding="p-4">
              <div className="text-[11px] font-bold tracking-[0.06em] uppercase text-slate-500 mb-3">Registro de entrega</div>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-slate-600">Fecha</span><span className="font-semibold text-slate-950">{order.delivery.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Lugar</span><span className="font-semibold text-slate-950">{order.delivery.loc}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Recibió</span><span className="font-semibold text-slate-950">{order.delivery.receiver}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Documento</span><span className="font-semibold text-slate-950">{order.delivery.doc}</span></div>
              </div>
            </DCard>
          )}

          {order.note && (
            <DCard padding="p-4">
              <div className="text-[11px] font-bold tracking-[0.06em] uppercase text-slate-500 mb-2">Observaciones</div>
              <p className="text-[12px] text-slate-700 leading-relaxed">{order.note}</p>
            </DCard>
          )}
        </div>

        {!isDelivered && !isCancelled && (
          <div className="border-t border-slate-200 p-3 flex items-center gap-2 flex-none">
            {order.state === "pending" && (
              <>
                <DButton variant="primary" onClick={onApprove} className="flex-1">Aprobar</DButton>
                <DButton variant="ghost" onClick={onCancel}>Cancelar</DButton>
              </>
            )}
            {order.state === "approved" && (
              <>
                <DButton variant="primary" onClick={onDeliver} className="flex-1">Registrar entrega</DButton>
                <DButton variant="ghost" onClick={onCancel}>Cancelar</DButton>
              </>
            )}
            {order.state === "transit" && (
              <DButton variant="primary" onClick={onDeliver} className="flex-1">Recibir</DButton>
            )}
            {order.state === "draft" && (
              <DButton variant="secondary" onClick={onClose} className="flex-1">Cerrar</DButton>
            )}
            {order.state === "late" && (
              <>
                <DButton variant="primary" onClick={onDeliver} className="flex-1">Registrar entrega</DButton>
                <DButton variant="ghost" onClick={onCancel}>Cancelar pedido</DButton>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-slate-500 mb-[2px]">{label}</div>
      <div className={"text-slate-950 " + (bold ? "font-extrabold" : "font-semibold")}>{value}</div>
    </div>
  );
}
