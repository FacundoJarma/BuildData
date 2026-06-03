// NuevaObraModal — multi-step wizard that appears when clicking "Nueva obra"
// from Obras.html. 4 steps: tipo → datos básicos → equipo → conexión WhatsApp.
// Final step shows a success state with link to the new obra's dashboard.

const TIPOS = [
  { id: 'edificio',   name: 'Edificio en altura',     sub: 'Residencial multifamiliar',  duration: '12-24 meses', color: '#0F4395' },
  { id: 'vivienda',   name: 'Vivienda unifamiliar',   sub: 'Casa o dúplex',              duration: '6-12 meses',  color: '#22C55E' },
  { id: 'refaccion',  name: 'Refacción / remodelación', sub: 'Reforma de obra existente', duration: '2-6 meses',   color: '#F59E0B' },
  { id: 'comercial',  name: 'Comercial / industrial', sub: 'Oficinas, locales, depósito', duration: '6-18 meses',  color: '#1A2238' },
];

const PLANTILLAS = [
  { id: 'desde-cero',    name: 'Desde cero',          sub: 'Yo voy cargando todo',           icon: 'plus' },
  { id: 'plantilla',     name: 'Usar plantilla',      sub: 'Rubros y tareas típicas precargadas', icon: 'grid' },
  { id: 'importar',      name: 'Importar Excel',      sub: 'Tengo un cronograma armado',      icon: 'download' },
];

const ROLES = [
  { id: 'director',  label: 'Director' },
  { id: 'capataz',   label: 'Capataz' },
  { id: 'compras',   label: 'Compras' },
  { id: 'arquitecto', label: 'Arquitecto/a' },
  { id: 'cliente',   label: 'Cliente' },
];

const NuevaObraModal = ({ open, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    tipo: 'edificio',
    plantilla: 'plantilla',
    nombre: '',
    codigo: '',
    direccion: '',
    inicio: '',
    fin: '',
    team: [
      { name: '', phone: '', role: 'capataz' },
    ],
    waConnect: false,
  });

  // Reset when re-opened
  React.useEffect(() => {
    if (open) { setStep(1); }
  }, [open]);

  // Lock body scroll when modal open
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  if (!open) return null;

  const upd = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const addMember = () => upd('team', [...data.team, { name: '', phone: '', role: 'capataz' }]);
  const updMember = (i, k, v) => {
    const next = [...data.team];
    next[i] = { ...next[i], [k]: v };
    upd('team', next);
  };
  const removeMember = (i) => upd('team', data.team.filter((_, idx) => idx !== i));

  const canNext =
    (step === 1 && data.tipo && data.plantilla) ||
    (step === 2 && data.nombre.trim().length > 1) ||
    (step === 3) ||
    (step === 4);

  const totalSteps = 4;
  const tipo = TIPOS.find((t) => t.id === data.tipo);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate950/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-big w-full max-w-[820px] max-h-[90vh] flex flex-col overflow-hidden animate-modal-in" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-7 pt-6 pb-4 border-b border-slate200 flex items-start justify-between gap-4 flex-none">
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-primary mb-1">
              {step <= totalSteps ? `Paso ${step} de ${totalSteps}` : '¡Listo!'}
            </div>
            <h2 className="text-[22px] font-extrabold display-tight text-slate950 leading-tight">
              {step === 1 && 'Empecemos con lo básico'}
              {step === 2 && 'Datos de la obra'}
              {step === 3 && 'Sumá a tu equipo'}
              {step === 4 && 'Conectá WhatsApp'}
              {step === 5 && '¡Obra creada!'}
            </h2>
            <p className="text-[13px] text-slate500 mt-1">
              {step === 1 && 'Elegí el tipo y cómo querés arrancar.'}
              {step === 2 && 'Información mínima para empezar. Podés ajustar todo después.'}
              {step === 3 && 'Capataces, compras, dirección. Podés agregar más después.'}
              {step === 4 && 'Tu equipo reporta por WhatsApp y BuildData lo organiza acá.'}
              {step === 5 && 'Tu obra ya está lista. Llevátela al panel principal.'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md text-slate500 hover:text-slate950 hover:bg-slate100 flex items-center justify-center flex-none">
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Progress dots */}
        {step <= totalSteps && (
          <div className="px-7 py-3 bg-slate50 border-b border-slate200 flex items-center gap-2 flex-none">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-[4px] rounded-full flex-1 transition-colors
                ${s < step ? 'bg-primary' : s === step ? 'bg-primary' : 'bg-slate200'}`} />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {step === 1 && (
            <>
              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Tipo de obra</div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {TIPOS.map((t) => {
                  const on = data.tipo === t.id;
                  return (
                    <button key={t.id} onClick={() => upd('tipo', t.id)}
                      className={`text-left rounded-lg border p-4 transition-all
                        ${on ? 'border-primary bg-primary-50 ring-2 ring-primary/20' : 'border-slate200 bg-white hover:border-slate300'}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md flex items-center justify-center flex-none" style={{ background: t.color + '20' }}>
                          <svg width="18" height="14" viewBox="0 0 60 40">
                            <rect x="6"  y="22" width="9" height="14" rx="1.5" fill={t.color} opacity="0.6"/>
                            <rect x="20" y="14" width="9" height="22" rx="1.5" fill={t.color} opacity="0.85"/>
                            <rect x="34" y="4"  width="9" height="32" rx="1.5" fill={t.color}/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[13.5px] font-bold ${on ? 'text-primary' : 'text-slate950'}`}>{t.name}</div>
                          <div className="text-[11px] text-slate500 mt-[2px]">{t.sub}</div>
                          <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate400 mt-2">Duración típica · {t.duration}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-none flex items-center justify-center
                          ${on ? 'border-primary bg-primary' : 'border-slate300 bg-white'}`}>
                          {on && <Icon name="check" size={11} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">¿Cómo querés arrancar?</div>
              <div className="grid grid-cols-3 gap-3">
                {PLANTILLAS.map((p) => {
                  const on = data.plantilla === p.id;
                  return (
                    <button key={p.id} onClick={() => upd('plantilla', p.id)}
                      className={`rounded-lg border p-4 text-left transition-all
                        ${on ? 'border-primary bg-primary-50 ring-2 ring-primary/20' : 'border-slate200 bg-white hover:border-slate300'}`}>
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3
                        ${on ? 'bg-primary text-white' : 'bg-slate100 text-slate600'}`}>
                        <Icon name={p.icon} size={15} />
                      </div>
                      <div className={`text-[13px] font-bold ${on ? 'text-primary' : 'text-slate950'}`}>{p.name}</div>
                      <div className="text-[11px] text-slate500 mt-[2px] leading-snug">{p.sub}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre de la obra" span={2} hint="Es lo que tu equipo va a ver en WhatsApp.">
                <Input autoFocus value={data.nombre} onChange={(e) => upd('nombre', e.target.value)} placeholder="Ej. Edificio Belgrano" />
              </Field>
              <Field label="Código interno" hint="Opcional · para tus referencias.">
                <Input value={data.codigo} onChange={(e) => upd('codigo', e.target.value)} placeholder="OBR-2026-001" />
              </Field>
              <Field label="Tipo">
                <Input value={tipo.name} disabled />
              </Field>
              <Field label="Dirección" span={2}>
                <Input value={data.direccion} onChange={(e) => upd('direccion', e.target.value)} placeholder="Av. Belgrano 1842, CABA" />
              </Field>
              <Field label="Inicio">
                <Input type="date" value={data.inicio} onChange={(e) => upd('inicio', e.target.value)} />
              </Field>
              <Field label="Fin estimado">
                <Input type="date" value={data.fin} onChange={(e) => upd('fin', e.target.value)} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="bg-primary-50 border border-primary/15 rounded-lg p-4 mb-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-white text-primary flex items-center justify-center flex-none">
                  <Icon name="info" size={14} />
                </div>
                <div className="text-[12px] text-slate700 leading-snug">
                  <b className="text-slate950">Vos ya estás incluido como administrador.</b> Sumá a quienes vayan a reportar por WhatsApp — pueden ser hasta 20 personas.
                </div>
              </div>

              <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mb-3">Miembros del equipo</div>
              <div className="space-y-3">
                {data.team.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_140px_36px] gap-2 items-end">
                    <Field label={i === 0 ? 'Nombre' : ''}>
                      <Input value={m.name} onChange={(e) => updMember(i, 'name', e.target.value)} placeholder="C. Ríos" />
                    </Field>
                    <Field label={i === 0 ? 'WhatsApp' : ''}>
                      <Input value={m.phone} onChange={(e) => updMember(i, 'phone', e.target.value)} placeholder="+54 9 11 5432-1098" />
                    </Field>
                    <Field label={i === 0 ? 'Rol' : ''}>
                      <Select value={m.role} onChange={(e) => updMember(i, 'role', e.target.value)}>
                        {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </Select>
                    </Field>
                    <button onClick={() => removeMember(i)}
                      className="w-9 h-9 rounded-md border border-slate200 text-slate500 hover:text-critical hover:border-critical flex items-center justify-center mb-[1px]">
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addMember}
                className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-primary hover:underline">
                <Icon name="plus" size={13} /> Agregar otra persona
              </button>

              <div className="mt-6 text-[11px] text-slate500 leading-snug">
                Vas a poder copiar un link de invitación al finalizar — cada persona se suma confirmando su número en WhatsApp.
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="bg-[#075E54] text-white rounded-xl p-5 mb-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-none">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-extrabold">El núcleo de BuildData</div>
                  <div className="text-[12px] text-white/70 mt-[2px] leading-snug">Tu equipo reporta como siempre. Nosotros transcribimos, clasificamos y guardamos todo acá.</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => upd('waConnect', true)}
                  className={`text-left rounded-lg border p-4 transition-all
                    ${data.waConnect ? 'border-primary bg-primary-50 ring-2 ring-primary/20' : 'border-slate200 bg-white hover:border-slate300'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-md bg-success50 text-[#15803D] flex items-center justify-center">
                      <Icon name="check-circle" size={15} />
                    </div>
                    <div className="text-[13.5px] font-bold text-slate950">Conectar ahora</div>
                    <DPill tone="successSolid">Recomendado</DPill>
                  </div>
                  <div className="text-[12px] text-slate600 leading-snug">Escaneás un QR desde el celular del jefe de obra. Tarda ~2 min.</div>
                </button>

                <button onClick={() => upd('waConnect', false)}
                  className={`text-left rounded-lg border p-4 transition-all
                    ${!data.waConnect ? 'border-primary bg-primary-50 ring-2 ring-primary/20' : 'border-slate200 bg-white hover:border-slate300'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-md bg-slate100 text-slate600 flex items-center justify-center">
                      <Icon name="clock" size={15} />
                    </div>
                    <div className="text-[13.5px] font-bold text-slate950">Después</div>
                  </div>
                  <div className="text-[12px] text-slate600 leading-snug">Configurás el bot más tarde desde el panel. La obra se crea igual.</div>
                </button>
              </div>

              {data.waConnect && (
                <div className="mt-5 bg-slate50 border border-slate200 rounded-lg p-5 flex items-center gap-5">
                  {/* Fake QR */}
                  <div className="w-[140px] h-[140px] bg-white border border-slate200 rounded-lg p-2 flex-none relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Random QR-like pattern */}
                      {[...Array(15)].map((_, r) => [...Array(15)].map((_, c) => (
                        ((r * 37 + c * 53) % 7) < 3 && <rect key={r+'-'+c} x={c*6+5} y={r*6+5} width="5" height="5" fill="#0F172A"/>
                      )))}
                      {/* corners */}
                      {[[5,5],[75,5],[5,75]].map(([x,y]) => (
                        <React.Fragment key={x+'-'+y}>
                          <rect x={x} y={y} width="20" height="20" fill="none" stroke="#0F172A" strokeWidth="3"/>
                          <rect x={x+7} y={y+7} width="6" height="6" fill="#0F172A"/>
                        </React.Fragment>
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-card">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                          <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-slate950 mb-2">Escaneá este código desde WhatsApp</div>
                    <ol className="text-[12px] text-slate600 leading-relaxed space-y-1 list-decimal pl-4">
                      <li>Abrí WhatsApp en el celular del jefe de obra.</li>
                      <li>Andá a <b>Configuración → Dispositivos vinculados</b>.</li>
                      <li>Tocá <b>Vincular un dispositivo</b> y escaneá el QR.</li>
                    </ol>
                    <div className="text-[10px] text-slate400 mt-3">El QR se renueva cada 60 segundos.</div>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-success50 text-success flex items-center justify-center mx-auto mb-5">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.1V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
              </div>
              <h3 className="text-[24px] font-extrabold display-tight">{data.nombre || 'Tu nueva obra'} está lista</h3>
              <p className="text-[13.5px] text-slate600 leading-relaxed max-w-[460px] mx-auto mt-3">
                Creamos la estructura inicial con los rubros típicos de <b>{tipo.name.toLowerCase()}</b>.
                {data.waConnect ? ' El bot de WhatsApp ya está conectado.' : ' Cuando quieras, conectás WhatsApp desde Configuración.'}
              </p>
              <div className="grid grid-cols-3 gap-3 max-w-[460px] mx-auto mt-6 mb-7">
                <div className="bg-slate50 border border-slate200 rounded-lg p-3">
                  <div className="text-[20px] font-extrabold tnum">{data.team.filter(m => m.name.trim()).length + 1}</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mt-1">Personas</div>
                </div>
                <div className="bg-slate50 border border-slate200 rounded-lg p-3">
                  <div className="text-[20px] font-extrabold tnum">8</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mt-1">Rubros</div>
                </div>
                <div className="bg-slate50 border border-slate200 rounded-lg p-3">
                  <div className="text-[20px] font-extrabold tnum">~120</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mt-1">Tareas</div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <DButton variant="secondary" size="md" onClick={onClose}>Volver a Mis obras</DButton>
                <a href="Dashboard.html" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold rounded-md px-5 py-[10px] text-[13px] transition-colors">
                  Abrir dashboard <Icon name="arrow-right" size={14} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer / actions */}
        {step <= totalSteps && (
          <div className="px-7 py-4 bg-slate50 border-t border-slate200 flex items-center justify-between gap-3 flex-none">
            <button onClick={onClose} className="text-[12px] font-bold text-slate500 hover:text-slate950 px-3 py-2">
              Cancelar
            </button>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <DButton variant="secondary" size="md" onClick={() => setStep(step - 1)}>
                  Atrás
                </DButton>
              )}
              <button
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 disabled:bg-slate300 disabled:cursor-not-allowed text-white font-bold rounded-md px-5 py-[10px] text-[13px] transition-colors">
                {step === totalSteps ? 'Crear obra' : 'Siguiente'} <Icon name="arrow-right" size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { NuevaObraModal });
