// NuevaObra — multi-step wizard modal that opens from the "Nueva obra"
// buttons in Obras.html. 4 steps: básicos · ubicación · equipo · cronograma.
// Lateral progress rail on the left, content on the right, footer with
// back/next/create.

const TYPES = [
  { id: 'edificio',  name: 'Edificio en altura',     icon: 'chart',    sub: '8 rubros · ~120 tareas · 14 meses' },
  { id: 'vivienda',  name: 'Vivienda unifamiliar',   icon: 'grid',     sub: '6 rubros · ~60 tareas · 6 meses' },
  { id: 'refaccion', name: 'Refacción / remodelación', icon: 'package', sub: '4 rubros · ~30 tareas · 3 meses' },
  { id: 'comercial', name: 'Comercial / industrial', icon: 'truck',    sub: 'Custom · variable según proyecto' },
];

const TEMPLATES = [
  { id: 'desde-cero', name: 'Empezar desde cero',          sub: 'Yo cargo el cronograma manualmente.' },
  { id: 'plantilla',  name: 'Usar plantilla del tipo elegido', sub: 'Cronograma sugerido que después editás.', recommended: true },
  { id: 'importar',   name: 'Importar Excel / MS Project', sub: 'Subí tu Gantt y lo parseamos.' },
];

const PEOPLE = [
  { id: 'JM', name: 'J. Méndez',  role: 'Director' },
  { id: 'CR', name: 'C. Ríos',    role: 'Capataz' },
  { id: 'PS', name: 'P. Salas',   role: 'Capataz' },
  { id: 'LB', name: 'L. Benítez', role: 'Compras' },
  { id: 'MO', name: 'M. Ortiz',   role: 'Capataz' },
  { id: 'AG', name: 'A. Gómez',   role: 'Arquitecta' },
];

const STEPS = [
  { id: 1, label: 'Básicos',     sub: 'Nombre y tipo' },
  { id: 2, label: 'Ubicación',   sub: 'Dónde está' },
  { id: 3, label: 'Equipo',      sub: 'Quién participa' },
  { id: 4, label: 'Cronograma',  sub: 'Cómo arrancás' },
];

// --- Small primitives -------------------------------------------------------

const WField = ({ label, hint, children, span = 1 }) => (
  <label className={`flex flex-col gap-[6px] col-span-${span}`}>
    <span className="text-[11px] font-bold text-slate700">{label}</span>
    {children}
    {hint && <span className="text-[11px] text-slate500 leading-snug">{hint}</span>}
  </label>
);

const WInput = (props) => (
  <input {...props}
    className={`bg-white border border-slate200 rounded-md px-3 py-[9px] text-[13px] text-slate950
      focus:border-primary focus:outline-none transition-colors ${props.className || ''}`} />
);

const WSelect = ({ children, ...props }) => (
  <select {...props}
    className={`bg-white border border-slate200 rounded-md px-3 py-[9px] text-[13px] text-slate950
      focus:border-primary focus:outline-none transition-colors ${props.className || ''}`}>
    {children}
  </select>
);

const WTextarea = (props) => (
  <textarea {...props}
    className={`bg-white border border-slate200 rounded-md px-3 py-[9px] text-[13px] text-slate950 min-h-[70px]
      focus:border-primary focus:outline-none transition-colors resize-y ${props.className || ''}`} />
);

const PickCard = ({ on, onClick, icon, name, sub, recommended, children }) => (
  <button type="button" onClick={onClick}
    className={`text-left bg-white rounded-lg border-2 p-4 transition-all relative
      ${on ? 'border-primary shadow-card2' : 'border-slate200 hover:border-slate300'}`}>
    {recommended && (
      <span className="absolute -top-2 left-3 bg-accent text-slate950 text-[9px] tracking-wider uppercase font-extrabold px-2 py-[2px] rounded">
        Recomendado
      </span>
    )}
    {icon && (
      <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3
        ${on ? 'bg-primary-50 text-primary' : 'bg-slate100 text-slate600'}`}>
        <Icon name={icon} size={16} />
      </div>
    )}
    <div className="text-[13px] font-bold text-slate950">{name}</div>
    <div className="text-[11px] text-slate500 leading-snug mt-[2px]">{sub}</div>
    {children}
    {on && (
      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
        <Icon name="check" size={12} />
      </div>
    )}
  </button>
);

// --- Step components --------------------------------------------------------

const Step1 = ({ data, setData }) => (
  <div className="space-y-5">
    <div>
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Información básica</div>
      <div className="grid grid-cols-2 gap-4">
        <WField label="Nombre de la obra*" hint="Ej: Edificio Belgrano, Casa Villa Urquiza…" span={2}>
          <WInput value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Nombre que ve todo el equipo" />
        </WField>
        <WField label="Código interno" hint="Opcional · para referencias con proveedores.">
          <WInput value={data.code} onChange={(e) => setData({ ...data, code: e.target.value })} placeholder="OBR-2026-001" />
        </WField>
        <WField label="Estado inicial">
          <WSelect value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })}>
            <option value="planificacion">En planificación</option>
            <option value="en-curso">En curso</option>
          </WSelect>
        </WField>
      </div>
    </div>

    <div>
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Tipo de obra*</div>
      <div className="grid grid-cols-2 gap-3">
        {TYPES.map((t) => (
          <PickCard key={t.id} on={data.type === t.id} onClick={() => setData({ ...data, type: t.id })}
            icon={t.icon} name={t.name} sub={t.sub} />
        ))}
      </div>
    </div>
  </div>
);

const Step2 = ({ data, setData }) => (
  <div className="space-y-5">
    <div>
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Dirección de obra</div>
      <div className="grid grid-cols-3 gap-4">
        <WField label="Dirección*" span={2}>
          <WInput value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} placeholder="Av. Belgrano 1842" />
        </WField>
        <WField label="Localidad">
          <WInput value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} placeholder="CABA" />
        </WField>
        <WField label="Provincia">
          <WInput value={data.province} onChange={(e) => setData({ ...data, province: e.target.value })} placeholder="Buenos Aires" />
        </WField>
        <WField label="Código postal">
          <WInput value={data.zip} onChange={(e) => setData({ ...data, zip: e.target.value })} placeholder="C1093" />
        </WField>
        <WField label="País">
          <WSelect value={data.country} onChange={(e) => setData({ ...data, country: e.target.value })}>
            <option value="ar">Argentina</option><option value="uy">Uruguay</option>
            <option value="cl">Chile</option><option value="mx">México</option>
          </WSelect>
        </WField>
      </div>
    </div>

    {/* Stylised mini map preview */}
    <div className="rounded-lg border border-slate200 overflow-hidden h-[160px] relative bg-slate100">
      <svg viewBox="0 0 600 160" className="w-full h-full">
        <rect width="600" height="160" fill="#EFF4FC"/>
        {[...Array(7)].map((_, i) => (
          <line key={'h'+i} x1="0" x2="600" y1={20 + i*22} y2={20 + i*22} stroke="#CBD5E1" strokeWidth="0.5"/>
        ))}
        {[...Array(14)].map((_, i) => (
          <line key={'v'+i} x1={i*44} x2={i*44} y1="0" y2="160" stroke="#CBD5E1" strokeWidth="0.5"/>
        ))}
        <path d="M0 90 L240 90 L240 50 L420 50 L420 120 L600 120" stroke="#94A3B8" strokeWidth="3" fill="none"/>
        <circle cx="300" cy="80" r="14" fill="#F59E0B"/>
        <circle cx="300" cy="80" r="6" fill="#fff"/>
      </svg>
      <div className="absolute bottom-3 left-3 bg-white rounded-md px-3 py-2 shadow-card text-[12px] font-bold text-slate950 flex items-center gap-2">
        <Icon name="alert" size={12} className="text-accent" />
        {data.address || 'Dirección de obra'}{data.city ? `, ${data.city}` : ''}
      </div>
    </div>

    <div className="bg-info50 border border-[#BFDBFE] rounded-lg p-4 flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-info text-white flex items-center justify-center flex-none">
        <Icon name="info" size={13} />
      </div>
      <div className="text-[12px] text-slate700 leading-snug">
        Usamos la dirección para <b>georreferenciar fotos y reportes</b> que tu equipo manda por WhatsApp. Nunca compartimos esto con nadie.
      </div>
    </div>
  </div>
);

const Step3 = ({ data, setData }) => {
  const toggle = (id) => {
    const has = data.team.includes(id);
    setData({ ...data, team: has ? data.team.filter((x) => x !== id) : [...data.team, id] });
  };
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Tu rol en esta obra</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'director',   label: 'Director de obra', sub: 'Ve todo. Aprueba pedidos.' },
            { id: 'arquitecto', label: 'Arquitecto/a',     sub: 'Revisa avance y fotos.' },
            { id: 'compras',    label: 'Compras',          sub: 'Gestiona pedidos.' },
            { id: 'capataz',    label: 'Capataz',          sub: 'Reporta desde obra.' },
          ].map((r) => (
            <PickCard key={r.id} on={data.myRole === r.id} onClick={() => setData({ ...data, myRole: r.id })}
              name={r.label} sub={r.sub} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500">Invitar al equipo</div>
            <div className="text-[11px] text-slate500 mt-[1px]">Elegí de tu agenda o sumá nuevos por WhatsApp.</div>
          </div>
          <div className="text-[11px] text-slate600 font-semibold">
            {data.team.length} seleccionado{data.team.length === 1 ? '' : 's'}
          </div>
        </div>
        <div className="bg-white border border-slate200 rounded-lg divide-y divide-slate100">
          {PEOPLE.map((p) => {
            const on = data.team.includes(p.id);
            return (
              <button key={p.id} type="button" onClick={() => toggle(p.id)}
                className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-slate50 text-left">
                <DAvatar initials={p.id} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-slate950">{p.name}</div>
                  <div className="text-[11px] text-slate500">{p.role}</div>
                </div>
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-none
                  ${on ? 'bg-primary border-primary text-white' : 'border-slate300 bg-white'}`}>
                  {on && <Icon name="check" size={12} />}
                </span>
              </button>
            );
          })}
          <button type="button" className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-slate50 text-left text-primary">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-primary text-primary flex items-center justify-center">
              <Icon name="plus" size={13} />
            </div>
            <div className="text-[13px] font-bold">Invitar a alguien nuevo por WhatsApp</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ data, setData }) => (
  <div className="space-y-5">
    <div>
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Punto de partida</div>
      <div className="space-y-2">
        {TEMPLATES.map((t) => (
          <PickCard key={t.id} on={data.template === t.id} onClick={() => setData({ ...data, template: t.id })}
            name={t.name} sub={t.sub} recommended={t.recommended} />
        ))}
      </div>
    </div>
    <div>
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Fechas estimadas</div>
      <div className="grid grid-cols-2 gap-4">
        <WField label="Inicio de obra">
          <WInput type="date" value={data.startDate} onChange={(e) => setData({ ...data, startDate: e.target.value })} />
        </WField>
        <WField label="Fin estimado" hint="Opcional · podés definirlo después.">
          <WInput type="date" value={data.endDate} onChange={(e) => setData({ ...data, endDate: e.target.value })} />
        </WField>
      </div>
    </div>

    {/* Recap */}
    <div className="bg-paper border border-slate200 rounded-lg p-4">
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-2">Resumen</div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[12px]">
        <div className="text-slate500">Nombre</div><div className="font-bold text-slate950">{data.name || '—'}</div>
        <div className="text-slate500">Tipo</div><div className="font-bold text-slate950">{TYPES.find((t) => t.id === data.type)?.name || '—'}</div>
        <div className="text-slate500">Ubicación</div><div className="font-bold text-slate950 truncate">{data.address ? `${data.address}, ${data.city}` : '—'}</div>
        <div className="text-slate500">Equipo</div><div className="font-bold text-slate950">{data.team.length} persona{data.team.length === 1 ? '' : 's'}</div>
        <div className="text-slate500">Inicio</div><div className="font-bold text-slate950">{data.startDate || '—'}</div>
      </div>
    </div>
  </div>
);

// --- Wizard shell -----------------------------------------------------------

const NuevaObraModal = ({ open, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [created, setCreated] = React.useState(false);
  const [data, setData] = React.useState({
    name: '', code: '', status: 'planificacion', type: '',
    address: '', city: '', province: '', zip: '', country: 'ar',
    myRole: 'director', team: ['JM'],
    template: 'plantilla', startDate: '', endDate: '',
  });

  // Reset when opening
  React.useEffect(() => {
    if (open) { setStep(1); setCreated(false); }
  }, [open]);

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canNext = ({
    1: data.name.trim() && data.type,
    2: data.address.trim(),
    3: true,
    4: data.template,
  })[step];

  const next = () => {
    if (step < 4) setStep(step + 1);
    else setCreated(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate950/60 backdrop-blur-sm animate-modal-in">
      <div className="bg-white w-full max-w-[900px] max-h-[calc(100vh-32px)] rounded-2xl shadow-big overflow-hidden flex flex-col">

        {created ? (
          <SuccessState data={data} onClose={onClose} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate200 flex-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary-50 text-primary flex items-center justify-center">
                  <Icon name="plus" size={16} />
                </div>
                <div>
                  <div className="text-[15px] font-extrabold display-tight">Crear nueva obra</div>
                  <div className="text-[11px] text-slate500">Paso {step} de {STEPS.length} · {STEPS[step - 1].label}</div>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-md hover:bg-slate100 text-slate500 hover:text-slate950 flex items-center justify-center">
                <Icon name="x" size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Left rail */}
              <div className="w-[220px] bg-slate50 border-r border-slate200 p-4 flex flex-col gap-1 flex-none">
                {STEPS.map((s) => {
                  const isDone = s.id < step;
                  const isCurrent = s.id === step;
                  return (
                    <button key={s.id} type="button" onClick={() => isDone && setStep(s.id)}
                      className={`flex items-start gap-3 px-3 py-[10px] rounded-md text-left transition-colors
                        ${isCurrent ? 'bg-white shadow-card border border-slate200' : 'border border-transparent'}
                        ${isDone ? 'hover:bg-white cursor-pointer' : !isCurrent ? 'opacity-60 cursor-default' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-none
                        ${isDone ? 'bg-success text-white' : isCurrent ? 'bg-primary text-white' : 'bg-slate200 text-slate600'}`}>
                        {isDone ? <Icon name="check" size={12} /> : s.id}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[12px] font-bold leading-tight ${isCurrent ? 'text-slate950' : 'text-slate700'}`}>{s.label}</div>
                        <div className="text-[10px] text-slate500 leading-snug mt-[1px]">{s.sub}</div>
                      </div>
                    </button>
                  );
                })}

                <div className="mt-auto pt-3">
                  <div className="bg-white border border-slate200 rounded-md p-3 text-[11px] text-slate600 leading-snug">
                    <div className="flex items-center gap-1 font-bold text-slate950 mb-1">
                      <Icon name="info" size={12} className="text-primary" /> Podés editar todo después.
                    </div>
                    Ningún paso es definitivo. Cambiás equipo, fechas o cronograma cuando quieras.
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {step === 1 && <Step1 data={data} setData={setData} />}
                {step === 2 && <Step2 data={data} setData={setData} />}
                {step === 3 && <Step3 data={data} setData={setData} />}
                {step === 4 && <Step4 data={data} setData={setData} />}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate200 px-6 py-3 flex items-center justify-between bg-slate50 flex-none">
              <button onClick={onClose}
                className="text-[12px] font-bold text-slate600 hover:text-slate950 px-3 py-[8px]">
                Cancelar
              </button>
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)}
                    className="text-[13px] font-bold bg-white hover:bg-slate100 text-slate700 border border-slate300 rounded-md px-4 py-[9px]">
                    Atrás
                  </button>
                )}
                <button onClick={next} disabled={!canNext}
                  className={`inline-flex items-center gap-2 text-[13px] font-bold rounded-md px-4 py-[9px] transition-colors
                    ${canNext ? 'bg-primary hover:bg-primary-700 text-white' : 'bg-slate200 text-slate500 cursor-not-allowed'}`}>
                  {step === 4 ? <>Crear obra <Icon name="check" size={14} /></> : <>Siguiente <Icon name="arrow-right" size={14} /></>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Success state ----------------------------------------------------------

const SuccessState = ({ data, onClose }) => (
  <div className="flex flex-col">
    <div className="blueprint-bg px-8 py-10 text-center text-white relative overflow-hidden">
      <div className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-4 ring-4 ring-success/30">
        <Icon name="check" size={28} />
      </div>
      <h2 className="text-[26px] font-extrabold display-tight leading-tight">¡Tu obra está creada!</h2>
      <p className="text-[14px] text-white/70 mt-2 max-w-[480px] mx-auto leading-snug">
        <b className="text-white">{data.name}</b> ya está lista. Conectá ahora el bot de WhatsApp para que tu equipo empiece a reportar.
      </p>
    </div>

    <div className="p-8 space-y-3">
      <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-2">Próximos pasos sugeridos</div>
      {[
        { ico: 'message', tint: 'bg-success50 text-[#15803D]', title: 'Conectar el bot de WhatsApp',      sub: 'Escaneá el QR desde el celular del jefe de obra.', cta: 'Conectar ahora' },
        { ico: 'users',   tint: 'bg-info50 text-[#1D4ED8]',    title: `Invitar ${data.team.length === 0 ? 'al equipo' : 'a más personas'}`, sub: 'Los sumás por WhatsApp en 30 segundos.', cta: 'Invitar' },
        { ico: 'calendar',tint: 'bg-primary-50 text-primary',  title: 'Cargar el cronograma',              sub: 'Importá tu Excel o usá la plantilla sugerida.',     cta: 'Cargar' },
      ].map((s) => (
        <div key={s.title} className="flex items-center gap-3 border border-slate200 rounded-lg p-3 hover:bg-slate50">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-none ${s.tint}`}>
            <Icon name={s.ico} size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-slate950">{s.title}</div>
            <div className="text-[11px] text-slate500">{s.sub}</div>
          </div>
          <button className="text-[12px] font-bold text-primary hover:underline">{s.cta} →</button>
        </div>
      ))}
    </div>

    <div className="border-t border-slate200 px-8 py-4 flex items-center justify-between bg-slate50">
      <button onClick={onClose} className="text-[12px] font-bold text-slate600 hover:text-slate950">Más tarde</button>
      <a href="Dashboard.html" className="inline-flex items-center gap-2 text-[13px] font-bold bg-primary hover:bg-primary-700 text-white rounded-md px-4 py-[9px]">
        Ir al dashboard <Icon name="arrow-right" size={14} />
      </a>
    </div>
  </div>
);

Object.assign(window, { NuevaObraModal });
