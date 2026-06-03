// Settings page sections for Configuración.html.
// Three deep sections fully built (General de la obra, Integraciones,
// Notificaciones); the others have lighter content. The left sub-nav
// switches between them.

// -----------------------------------------------------------------------------
// Small form primitives
// -----------------------------------------------------------------------------

const Field = ({ label, hint, children, span = 1 }) => (
  <label className={`flex flex-col gap-[6px] col-span-${span}`}>
    <span className="text-[11px] font-bold text-slate700">{label}</span>
    {children}
    {hint && <span className="text-[11px] text-slate500 leading-snug">{hint}</span>}
  </label>
);

const Input = (props) => (
  <input {...props}
    className={`bg-white border border-slate200 rounded-md px-3 py-[8px] text-[13px] text-slate950
      focus:border-primary focus:outline-none transition-colors ${props.className || ''}`} />
);

const Select = ({ children, ...props }) => (
  <select {...props}
    className={`bg-white border border-slate200 rounded-md px-3 py-[8px] text-[13px] text-slate950
      focus:border-primary focus:outline-none transition-colors ${props.className || ''}`}>
    {children}
  </select>
);

const Textarea = (props) => (
  <textarea {...props}
    className={`bg-white border border-slate200 rounded-md px-3 py-[8px] text-[13px] text-slate950 min-h-[70px]
      focus:border-primary focus:outline-none transition-colors resize-y ${props.className || ''}`} />
);

const Toggle = ({ on, onChange, label, hint }) => (
  <div className="flex items-start justify-between gap-3 py-3">
    <div className="min-w-0">
      <div className="text-[13px] font-bold text-slate950">{label}</div>
      {hint && <div className="text-[11px] text-slate500 mt-[2px] leading-snug">{hint}</div>}
    </div>
    <button onClick={() => onChange(!on)}
      className={`w-[36px] h-[20px] rounded-full p-[2px] flex-none transition-colors
        ${on ? 'bg-primary' : 'bg-slate300'}`}>
      <span className={`block w-[16px] h-[16px] rounded-full bg-white shadow transition-transform
        ${on ? 'translate-x-[16px]' : 'translate-x-0'}`} />
    </button>
  </div>
);

const SettingsCard = ({ title, sub, right, children, footer }) => (
  <DCard padding="p-0" className="mb-4">
    <div className="px-5 py-4 border-b border-slate200 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[14px] font-bold text-slate950">{title}</div>
        {sub && <div className="text-[12px] text-slate500 mt-[2px] leading-snug">{sub}</div>}
      </div>
      {right && <div className="flex-none">{right}</div>}
    </div>
    <div className="p-5">{children}</div>
    {footer && <div className="px-5 py-3 border-t border-slate200 bg-slate50 flex justify-end gap-2">{footer}</div>}
  </DCard>
);

// -----------------------------------------------------------------------------
// 1) Obra — basic info, location, dates
// -----------------------------------------------------------------------------

const SecObra = () => {
  return (
    <>
      <SettingsCard
        title="Información general"
        sub="Datos básicos de la obra. Se muestran en reportes exportables y en la portada del PDF."
        footer={<><DButton variant="secondary" size="sm">Descartar</DButton><DButton variant="primary" size="sm">Guardar cambios</DButton></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre de la obra"><Input defaultValue="Edificio Belgrano" /></Field>
          <Field label="Código interno" hint="Opcional · para referencias internas y proveedores."><Input defaultValue="OBR-2025-014" /></Field>
          <Field label="Tipo de obra">
            <Select defaultValue="edificio">
              <option value="edificio">Edificio en altura</option>
              <option value="vivienda">Vivienda unifamiliar</option>
              <option value="refaccion">Refacción / remodelación</option>
              <option value="comercial">Comercial / industrial</option>
            </Select>
          </Field>
          <Field label="Estado actual">
            <Select defaultValue="en-curso">
              <option value="planificacion">En planificación</option>
              <option value="en-curso">En curso</option>
              <option value="pausada">Pausada</option>
              <option value="finalizada">Finalizada</option>
            </Select>
          </Field>
          <Field label="Descripción" span={2} hint="Visible para todo el equipo y los clientes que tengan acceso de solo lectura.">
            <Textarea defaultValue="Edificio residencial de 12 plantas con 48 unidades funcionales, locales comerciales en planta baja y dos subsuelos de cocheras." />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Ubicación"
        sub="Usamos la dirección para georreferenciar fotos y reportes desde WhatsApp."
        footer={<><DButton variant="secondary" size="sm">Descartar</DButton><DButton variant="primary" size="sm">Guardar cambios</DButton></>}
      >
        <div className="grid grid-cols-3 gap-4">
          <Field label="Dirección" span={2}><Input defaultValue="Av. Belgrano 1842" /></Field>
          <Field label="Localidad"><Input defaultValue="CABA" /></Field>
          <Field label="Provincia"><Input defaultValue="Buenos Aires" /></Field>
          <Field label="Código postal"><Input defaultValue="C1093" /></Field>
          <Field label="País">
            <Select defaultValue="ar">
              <option value="ar">Argentina</option>
              <option value="uy">Uruguay</option>
              <option value="cl">Chile</option>
              <option value="mx">México</option>
            </Select>
          </Field>
        </div>

        <div className="mt-4 rounded-lg border border-slate200 overflow-hidden h-[180px] relative bg-slate100">
          {/* Stylised map preview — no external assets */}
          <svg viewBox="0 0 600 180" className="w-full h-full">
            <rect width="600" height="180" fill="#EFF4FC"/>
            {[...Array(8)].map((_, i) => (
              <line key={'h'+i} x1="0" x2="600" y1={20 + i*22} y2={20 + i*22} stroke="#CBD5E1" strokeWidth="0.5"/>
            ))}
            {[...Array(14)].map((_, i) => (
              <line key={'v'+i} x1={i*44} x2={i*44} y1="0" y2="180" stroke="#CBD5E1" strokeWidth="0.5"/>
            ))}
            <path d="M0 100 L240 100 L240 60 L420 60 L420 130 L600 130" stroke="#94A3B8" strokeWidth="3" fill="none"/>
            <circle cx="300" cy="90" r="14" fill="#F59E0B"/>
            <circle cx="300" cy="90" r="6" fill="#fff"/>
          </svg>
          <div className="absolute bottom-3 left-3 bg-white rounded-md px-3 py-2 shadow-card text-[12px] font-bold text-slate950">
            Av. Belgrano 1842, CABA
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Cronograma maestro"
        sub="Fechas globales del proyecto. El cronograma detallado se gestiona desde la pantalla de Cronograma."
        footer={<DButton variant="primary" size="sm">Guardar cambios</DButton>}
      >
        <div className="grid grid-cols-3 gap-4">
          <Field label="Inicio de obra"><Input type="date" defaultValue="2025-03-15" /></Field>
          <Field label="Fin estimado"><Input type="date" defaultValue="2026-08-30" /></Field>
          <Field label="Duración total" hint="Calculado automáticamente."><Input value="17 meses" disabled /></Field>
        </div>
      </SettingsCard>
    </>
  );
};

// -----------------------------------------------------------------------------
// 2) Integraciones — WhatsApp, Excel, ERP
// -----------------------------------------------------------------------------

const IntegrationRow = ({ logo, name, sub, status, action }) => {
  const statusMap = {
    connected: { tag: 'CONECTADO', tone: 'successSolid' },
    pending:   { tag: 'PENDIENTE', tone: 'attentionSolid' },
    none:      { tag: 'NO CONECTADO', tone: 'slate' },
  };
  const s = statusMap[status];
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-none" style={{ background: logo.bg, color: logo.fg }}>
        <Icon name={logo.icon} size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-[14px] font-bold text-slate950">{name}</div>
          <DPill tone={s.tone}>{s.tag}</DPill>
        </div>
        <div className="text-[12px] text-slate500 mt-[2px] leading-snug">{sub}</div>
      </div>
      <div className="flex-none">{action}</div>
    </div>
  );
};

const SecIntegraciones = () => (
  <>
    <SettingsCard
      title="WhatsApp Business"
      sub="El núcleo de BuildData. Tu equipo reporta por WhatsApp y nosotros transcribimos, clasificamos y guardamos todo."
    >
      <div className="bg-success50 border border-[#BBF7D0] rounded-lg p-4 flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center flex-none">
          <Icon name="check" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-slate950">Bot conectado y operativo</div>
          <div className="text-[11px] text-slate600 mt-[2px] leading-snug">+54 9 11 2034‑8821 · 6 contactos activos · último mensaje hace 12 min</div>
        </div>
        <DButton variant="secondary" size="sm">Reconfigurar</DButton>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { v: '1,284', l: 'Mensajes este mes' },
          { v: '92 %',  l: 'Transcripciones correctas' },
          { v: '6',     l: 'Contactos en el grupo' },
        ].map((s) => (
          <div key={s.l} className="border border-slate200 rounded-md p-3">
            <div className="text-[20px] font-extrabold display-tight tnum">{s.v}</div>
            <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </SettingsCard>

    <SettingsCard
      title="Otras integraciones"
      sub="Conectá BuildData con las herramientas que ya usás."
    >
      <div className="divide-y divide-slate200 -my-4">
        <IntegrationRow
          logo={{ icon: 'chart', bg: '#107C41', fg: '#fff' }}
          name="Microsoft Excel"
          sub="Importá cronogramas y exportá reportes en formato .xlsx."
          status="connected"
          action={<DButton variant="secondary" size="sm">Gestionar</DButton>}
        />
        <IntegrationRow
          logo={{ icon: 'package', bg: '#0F4395', fg: '#fff' }}
          name="Tango Gestión"
          sub="Sincronizá pedidos de materiales con tu ERP."
          status="pending"
          action={<DButton variant="primary" size="sm">Completar conexión</DButton>}
        />
        <IntegrationRow
          logo={{ icon: 'database', bg: '#1A2238', fg: '#F59E0B' }}
          name="Google Drive"
          sub="Guardá fotos y documentos de obra en tu Drive corporativo."
          status="none"
          action={<DButton variant="secondary" size="sm">Conectar</DButton>}
        />
        <IntegrationRow
          logo={{ icon: 'calendar', bg: '#EA4335', fg: '#fff' }}
          name="Google Calendar"
          sub="Mostrá hitos del cronograma en tu calendario."
          status="none"
          action={<DButton variant="secondary" size="sm">Conectar</DButton>}
        />
        <IntegrationRow
          logo={{ icon: 'message', bg: '#5865F2', fg: '#fff' }}
          name="Slack"
          sub="Reenviá alertas críticas al canal de tu equipo."
          status="none"
          action={<DButton variant="secondary" size="sm">Conectar</DButton>}
        />
      </div>
    </SettingsCard>

    <SettingsCard title="API y webhooks" sub="Para integraciones a medida con tus propios sistemas.">
      <Field label="Endpoint">
        <div className="flex gap-2">
          <Input value="https://api.buildata.app/v1/webhooks/3f9d…b2a1" readOnly className="flex-1 font-mono text-[12px]" />
          <DButton variant="secondary" size="sm">Copiar</DButton>
          <DButton variant="secondary" size="sm">Regenerar</DButton>
        </div>
      </Field>
    </SettingsCard>
  </>
);

// -----------------------------------------------------------------------------
// 3) Notificaciones
// -----------------------------------------------------------------------------

const SecNotifs = () => {
  const [n, setN] = React.useState({
    critWA: true,  critEmail: true,
    impWA: true,   impEmail: false,
    daily: true,   weekly: true,
    weekendQuiet: false,
    nightQuiet: true,
  });
  const upd = (k) => (v) => setN((s) => ({ ...s, [k]: v }));

  return (
    <>
      <SettingsCard title="Notificaciones por tipo" sub="Elegí qué te avisamos y por dónde.">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-3 items-center">
          <div></div>
          <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 text-center">WhatsApp</div>
          <div className="text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 text-center">Email</div>

          {[
            { id: 'crit', label: 'Alertas críticas',     hint: 'Falta de material, fallas técnicas, accidentes.' },
            { id: 'imp',  label: 'Alertas importantes',  hint: 'Demoras, cuadrillas incompletas, faltantes.' },
            { id: 'daily',label: 'Resumen diario',       hint: 'Lo que pasó ayer, qué viene hoy. 8:00 AM.' },
            { id: 'weekly', label: 'Resumen semanal',    hint: 'Avance por rubro, pedidos del mes, problemas resueltos.' },
          ].map((row) => {
            const waKey = row.id + (row.id === 'daily' || row.id === 'weekly' ? '' : 'WA');
            const emailKey = row.id + (row.id === 'daily' || row.id === 'weekly' ? '' : 'Email');
            const isSummary = row.id === 'daily' || row.id === 'weekly';
            return (
              <React.Fragment key={row.id}>
                <div>
                  <div className="text-[13px] font-bold text-slate950">{row.label}</div>
                  <div className="text-[11px] text-slate500 leading-snug">{row.hint}</div>
                </div>
                <div className="text-center">
                  {!isSummary
                    ? <ToggleInline on={n[waKey]} onChange={upd(waKey)} />
                    : <ToggleInline on={n[row.id]} onChange={upd(row.id)} />}
                </div>
                <div className="text-center">
                  {!isSummary
                    ? <ToggleInline on={n[emailKey]} onChange={upd(emailKey)} />
                    : <span className="text-slate400 text-[11px]">—</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard title="Horarios silenciosos" sub="No te molestamos en estos rangos, salvo alertas críticas.">
        <Toggle on={n.nightQuiet} onChange={upd('nightQuiet')}
          label="No notificar de noche"
          hint="Entre las 22:00 y las 7:00 hs. Las críticas se entregan igual." />
        <div className="border-t border-slate100 my-1" />
        <Toggle on={n.weekendQuiet} onChange={upd('weekendQuiet')}
          label="Silencio los fines de semana"
          hint="Sábado y domingo solo recibís alertas críticas." />
      </SettingsCard>
    </>
  );
};

const ToggleInline = ({ on, onChange }) => (
  <button onClick={() => onChange(!on)}
    className={`w-[36px] h-[20px] rounded-full p-[2px] inline-flex transition-colors
      ${on ? 'bg-primary' : 'bg-slate300'}`}>
    <span className={`block w-[16px] h-[16px] rounded-full bg-white shadow transition-transform
      ${on ? 'translate-x-[16px]' : 'translate-x-0'}`} />
  </button>
);

// -----------------------------------------------------------------------------
// 4) Plan y facturación
// -----------------------------------------------------------------------------

const SecPlan = () => (
  <>
    <SettingsCard title="Tu plan actual">
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[24px] font-extrabold display-tight">Profesional</h3>
            <DPill tone="primary">ACTIVO</DPill>
          </div>
          <div className="text-[13px] text-slate600">
            Hasta 3 obras simultáneas · 20 personas por obra · IA ilimitada
          </div>
          <div className="text-[13px] text-slate950 mt-3">
            <b className="text-[18px] tnum">AR$ 89.000</b> <span className="text-slate500">/ mes</span> · Próximo cobro: <b>15 Jun 2026</b>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <a href="Planes.html" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold rounded-md px-4 py-[8px] text-[13px] transition-colors whitespace-nowrap">
            Ver todos los planes
          </a>
          <DButton variant="secondary" size="sm">Cancelar suscripción</DButton>
        </div>
      </div>
    </SettingsCard>

    <SettingsCard title="Método de pago">
      <div className="border border-slate200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-7 rounded bg-gradient-to-br from-primary to-info text-white text-[10px] font-bold flex items-center justify-center">VISA</div>
        <div className="flex-1">
          <div className="text-[13px] font-bold tnum">•••• •••• •••• 4242</div>
          <div className="text-[11px] text-slate500">Vence 08/27 · Titular J. Méndez</div>
        </div>
        <DButton variant="secondary" size="sm">Cambiar tarjeta</DButton>
      </div>
    </SettingsCard>

    <SettingsCard title="Historial de facturas">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="text-left text-[10px] tracking-[0.06em] uppercase font-bold text-slate500 border-b border-slate200">
            <th className="py-2">Fecha</th><th>Concepto</th><th>Monto</th><th>Estado</th><th></th>
          </tr>
        </thead>
        <tbody>
          {[
            { d: '15 May 2026', c: 'Plan Profesional · Mayo',  m: 'AR$ 89.000', s: 'PAGADA',    tone: 'successSolid' },
            { d: '15 Abr 2026', c: 'Plan Profesional · Abril', m: 'AR$ 89.000', s: 'PAGADA',    tone: 'successSolid' },
            { d: '15 Mar 2026', c: 'Plan Profesional · Marzo', m: 'AR$ 89.000', s: 'PAGADA',    tone: 'successSolid' },
            { d: '15 Feb 2026', c: 'Plan Profesional · Febrero', m: 'AR$ 89.000', s: 'PAGADA',    tone: 'successSolid' },
          ].map((r, i, a) => (
            <tr key={i} className={i < a.length - 1 ? 'border-b border-slate100' : ''}>
              <td className="py-3 text-slate600">{r.d}</td>
              <td className="font-semibold">{r.c}</td>
              <td className="tnum font-bold">{r.m}</td>
              <td><DPill tone={r.tone}>{r.s}</DPill></td>
              <td className="text-right"><button className="text-primary text-[12px] font-bold">Descargar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </SettingsCard>
  </>
);

// -----------------------------------------------------------------------------
// 5) Seguridad
// -----------------------------------------------------------------------------

const SecSeguridad = () => {
  const [tfa, setTfa] = React.useState(true);
  return (
    <>
      <SettingsCard title="Contraseña" footer={<DButton variant="primary" size="sm">Cambiar contraseña</DButton>}>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Contraseña actual"><Input type="password" defaultValue="••••••••••" /></Field>
          <Field label="Nueva contraseña"><Input type="password" placeholder="Mínimo 10 caracteres" /></Field>
          <Field label="Confirmar"><Input type="password" placeholder="Repetir nueva contraseña" /></Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Verificación en dos pasos">
        <Toggle on={tfa} onChange={setTfa}
          label="Activar 2FA por aplicación"
          hint="Pide un código de tu app autenticadora al iniciar sesión desde un dispositivo nuevo." />
      </SettingsCard>

      <SettingsCard title="Sesiones activas" sub="Cerrá sesiones que no reconozcas.">
        <div className="divide-y divide-slate100 -my-2">
          {[
            { ico: 'grid', dev: 'MacBook Pro · Chrome', loc: 'Buenos Aires · ahora',           tag: 'ACTUAL', tone: 'successSolid' },
            { ico: 'message', dev: 'iPhone 14 · App',   loc: 'Buenos Aires · hace 3 h',        tag: null },
            { ico: 'grid', dev: 'iPad · Safari',        loc: 'Mar del Plata · hace 5 días',    tag: null },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-md bg-slate100 text-slate700 flex items-center justify-center">
                <Icon name={s.ico} size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold flex items-center gap-2 flex-wrap">
                  {s.dev}
                  {s.tag && <DPill tone={s.tone}>{s.tag}</DPill>}
                </div>
                <div className="text-[11px] text-slate500">{s.loc}</div>
              </div>
              {!s.tag && <DButton variant="ghost" size="sm" className="text-[#B91C1C]">Cerrar sesión</DButton>}
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Zona peligrosa">
        <div className="border border-[#FECACA] bg-critical50 rounded-lg p-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[13px] font-bold text-[#B91C1C]">Eliminar cuenta</div>
            <div className="text-[12px] text-slate700 mt-[2px] leading-snug">Esta acción borra todas las obras, reportes y datos asociados. No se puede deshacer.</div>
          </div>
          <DButton variant="danger" size="sm">Eliminar cuenta</DButton>
        </div>
      </SettingsCard>
    </>
  );
};

// -----------------------------------------------------------------------------
// Page shell
// -----------------------------------------------------------------------------

const SETTINGS_NAV = [
  { id: 'obra',          label: 'Obra',                icon: 'grid',     Comp: SecObra },
  { id: 'integraciones', label: 'Integraciones',       icon: 'database', Comp: SecIntegraciones },
  { id: 'notificaciones',label: 'Notificaciones',      icon: 'bell',     Comp: SecNotifs },
  { id: 'plan',          label: 'Plan y facturación',  icon: 'package',  Comp: SecPlan },
  { id: 'seguridad',     label: 'Seguridad',           icon: 'check-circle', Comp: SecSeguridad },
];

const SettingsPage = () => {
  const [tab, setTab] = React.useState('obra');
  const cur = SETTINGS_NAV.find((x) => x.id === tab) || SETTINGS_NAV[0];

  return (
    <>
      <DPageHeader
        title="Configuración"
        subtitle="Datos de la obra, integraciones y preferencias de tu cuenta."
      />

      <div className="grid grid-cols-[220px_1fr] gap-6 items-start">
        <nav className="bg-white border border-slate200 rounded-lg p-2 flex flex-col gap-[2px] sticky top-2">
          {SETTINGS_NAV.map((s) => {
            const on = tab === s.id;
            return (
              <button key={s.id} onClick={() => setTab(s.id)}
                className={`flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-left transition-colors
                  ${on ? 'bg-primary-50 text-primary' : 'text-slate600 hover:bg-slate50'}`}>
                <Icon name={s.icon} size={14} className={on ? 'text-primary' : 'text-slate500'} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          <cur.Comp />
        </div>
      </div>
    </>
  );
};

Object.assign(window, { SettingsPage });
