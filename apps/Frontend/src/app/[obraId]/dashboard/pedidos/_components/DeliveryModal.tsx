"use client";

import { useState } from "react";
import { Xmark, Car } from "@gravity-ui/icons";
import DButton from "@/components/ui/Button";
import type { PedidoItem } from "../data";

interface DeliveryData {
  date: string;
  time: string;
  loc: string;
  receiver: string;
  doc: string;
}

interface Props {
  order: PedidoItem;
  onClose: () => void;
  onSave: (delivery: DeliveryData) => void;
}

export function DeliveryModal({ order, onClose, onSave }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [loc, setLoc] = useState("");
  const [receiver, setReceiver] = useState("");
  const [doc, setDoc] = useState("");

  const canSave = loc.trim() && receiver.trim();

  const submit = () => {
    if (!canSave) return;
    onSave({ date: date || today, time, loc: loc.trim(), receiver: receiver.trim(), doc: doc.trim() });
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-task">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[480px] rounded-2xl shadow-big overflow-hidden flex flex-col animate-modal-pop">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-success-50 text-[#15803D] flex items-center justify-center">
              <Car width={16} height={16} />
            </div>
            <div>
              <div className="text-[15px] font-extrabold display-tight">Registrar entrega</div>
              <div className="text-[11px] text-slate-500">{order.id} &middot; {order.mat}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-950 flex items-center justify-center">
            <Xmark width={16} height={16} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Fecha</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none" />
            </label>
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-slate-700">Hora</span>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none" />
            </label>
          </div>
          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Lugar de entrega*</span>
            <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Ej: Depósito A, acceso lateral"
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none" />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Recibió*</span>
            <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Nombre de quien recibe"
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none" />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-bold text-slate-700">Documento</span>
            <input value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="DNI / LEGAJO"
              className="bg-white border border-slate-200 rounded-md px-3 py-[9px] text-[13px] focus:border-primary focus:outline-none" />
          </label>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-none">
          <DButton variant="ghost" onClick={onClose}>Cancelar</DButton>
          <DButton onClick={submit} disabled={!canSave}>Registrar entrega</DButton>
        </div>
      </div>
    </div>
  );
}
