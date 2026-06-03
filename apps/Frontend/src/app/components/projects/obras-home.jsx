// ObrasHome — workspace-level "home" page. Lists obras the user has access
// to, with grid/list toggle, quick access to recent ones, and a recent files
// strip. This is the screen that comes BEFORE the per-obra Dashboard:
// Login → Obras → click obra → Dashboard.

// ---------------------------------------------------------------------------
// Fixture data — 6 obras at different stages
// ---------------------------------------------------------------------------

const OBRAS = [
  {
    id: 'belgrano',
    name: 'Edificio Belgrano',
    code: 'OBR-2025-014',
    address: 'Av. Belgrano 1842, CABA',
    type: 'Edificio en altura',
    status: 'en-curso',
    progress: 68,
    alerts: 2,
    pedidos: 7,
    team: ['JM', 'CR', 'PS', 'LB', 'MO'],
    lastActivity: 'hace 12 min',
    lastActivityWho: 'P. Salas reportó falla en grúa',
    starred: true,
    color: '#0F4395',
  },
  {
    id: 'palermo',
    name: 'Torre Palermo Norte',
    code: 'OBR-2025-008',
    address: 'Av. Santa Fe 4920, CABA',
    type: 'Edificio en altura',
    status: 'en-curso',
    progress: 42,
    alerts: 0,
    pedidos: 3,
    team: ['AG', 'CR', 'LB'],
    lastActivity: 'hace 1 h',
    lastActivityWho: 'C. Ríos subió 6 fotos',
    starred: true,
    color: '#0B3275',
  },
  {
    id: 'villa-urquiza',
    name: 'Casa Villa Urquiza',
    code: 'OBR-2025-019',
    address: 'Bauness 2104, CABA',
    type: 'Vivienda unifamiliar',
    status: 'planificacion',
    progress: 8,
    alerts: 1,
    pedidos: 2,
    team: ['JM', 'AG'],
    lastActivity: 'ayer 18:30',
    lastActivityWho: 'A. Gómez cargó planos',
    starred: false,
    color: '#F59E0B',
  },
  {
    id: 'oficinas-pilar',
    name: 'Oficinas Pilar',
    code: 'OBR-2024-031',
    address: 'Ruta 8 km 49, Pilar',
    type: 'Comercial / industrial',
    status: 'en-curso',
    progress: 84,
    alerts: 0,
    pedidos: 1,
    team: ['JM', 'MO', 'LB', 'PS', 'CR', 'AG'],
    lastActivity: 'hoy 09:14',
    lastActivityWho: 'L. Benítez aprobó pedido',
    starred: false,
    color: '#22C55E',
  },
  {
    id: 'refaccion-recoleta',
    name: 'Refacción Recoleta',
    code: 'OBR-2024-022',
    address: 'Junín 1410, CABA',
    type: 'Refacción',
    status: 'pausada',
    progress: 55,
    alerts: 3,
    pedidos: 0,
    team: ['MO', 'PS'],
    lastActivity: 'hace 5 días',
    lastActivityWho: 'Obra en pausa por cliente',
    starred: false,
    color: '#94A3B8',
  },
  {
    id: 'casa-tigre',
    name: 'Casa de Fin de Semana · Tigre',
    code: 'OBR-2024-007',
    address: 'Canal San Fernando 280',
    type: 'Vivienda unifamiliar',
    status: 'finalizada',
    progress: 100,
    alerts: 0,
    pedidos: 0,
    team: ['JM', 'AG', 'CR'],
    lastActivity: '12 Mar 2025',
    lastActivityWho: 'Entregada al cliente',
    starred: false,
    color: '#1A2238',
  },
];

const FILES = [
  { name: 'Cronograma_Belgrano_v3.xlsx', kind: 'xlsx',  obra: 'Edificio Belgrano',    when: 'hace 2 h',   size: '1.2 MB' },
  { name: 'Plano Sector C - planta 4.pdf', kind: 'pdf',  obra: 'Edificio Belgrano',    when: 'ayer',        size: '4.8 MB' },
  { name: 'IMG_2034.jpg',                  kind: 'img',  obra: 'Torre Palermo Norte',  when: 'hoy 10:15',   size: '2.1 MB' },
  { name: 'Pedido_PED-0142.pdf',           kind: 'pdf',  obra: 'Edificio Belgrano',    when: 'ayer 17:30',  size: '180 KB' },
  { name: 'Memoria descriptiva.docx',     kind: 'doc',  obra: 'Casa Villa Urquiza',   when: '12 May',      size: '420 KB' },
  { name: 'Reporte_semanal_S20.pdf',       kind: 'pdf',  obra: 'Oficinas Pilar',       when: '11 May',      size: '900 KB' },
];

// ---------------------------------------------------------------------------
// Status / file primitives
// ---------------------------------------------------------------------------

const STATUS = {
  'en-curso':       { label: 'En curso',       tone: 'successSolid', dot: '#22C55E' },
  'planificacion':  { label: 'Planificación',  tone: 'info',         dot: '#3B82F6' },
  'pausada':        { label: 'Pausada',        tone: 'attentionSolid', dot: '#F59E0B' },
  'finalizada':     { label: 'Finalizada',     tone: 'slate',        dot: '#64748B' },
};

const FileIcon = ({ kind, size = 36 }) => {
  const palettes = {
    pdf:  { bg: '#FEF2F2', fg: '#B91C1C', label: 'PDF'  },
    xlsx: { bg: '#F0FDF4', fg: '#15803D', label: 'XLSX' },
    doc:  { bg: '#EFF6FF', fg: '#1D4ED8', label: 'DOC'  },
    img:  { bg: '#FFFBEB', fg: '#B45309', label: 'IMG'  },
  };
  const p = palettes[kind] || palettes.doc;
  return (
    <div className="rounded-md flex flex-col items-center justify-center font-extrabold text-[10px] tracking-wider"
      style={{ width: size, height: size * 1.2, background: p.bg, color: p.fg }}>
      {p.label}
    </div>
  );
};

// Stylised thumbnail per obra — 3 styles selectable via tweak.
// - blueprint: gridded pattern + tilted bar chart (the construction look)
// - minimal:   solid color band + giant initial letter (architectural / typographic)
// - swatch:    bold diagonal color split with progress as the headline (paint-chip look)
const ObraThumb = ({ obra, height = 100, variant = 'blueprint' }) => {
  if (variant === 'minimal') {
    return (
      <div className="relative w-full overflow-hidden rounded-t-lg flex items-center justify-center" style={{ height, background: obra.color }}>
        <div className="text-white font-extrabold display-tight leading-none" style={{ fontSize: height * 0.62, letterSpacing: '-0.04em' }}>
          {obra.name[0]}
        </div>
        <div className="absolute top-3 left-3 text-[9px] tracking-[0.12em] uppercase font-bold text-white/60">{obra.code}</div>
        {obra.starred && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" className="absolute top-3 right-3">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/35 to-transparent flex items-center gap-2">
          <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${obra.progress}%` }}/>
          </div>
          <div className="text-[10px] font-bold text-white tnum">{obra.progress}%</div>
        </div>
      </div>
    );
  }

  if (variant === 'swatch') {
    return (
      <div className="relative w-full overflow-hidden rounded-t-lg flex items-stretch" style={{ height, background: '#FCF8FA' }}>
        {/* Diagonal color block */}
        <div className="absolute inset-0" style={{ background: obra.color, clipPath: 'polygon(0 0, 65% 0, 50% 100%, 0 100%)' }} />
        {/* Right side: percent headline */}
        <div className="absolute inset-y-0 right-0 w-[45%] flex flex-col items-end justify-center pr-4 text-right">
          <div className="text-[10px] tracking-[0.12em] uppercase font-bold text-slate500">Avance</div>
          <div className="text-slate950 font-extrabold display-tight tnum leading-none" style={{ fontSize: height * 0.46, letterSpacing: '-0.04em' }}>
            {obra.progress}<span className="text-[40%] text-slate500"> %</span>
          </div>
        </div>
        {/* Left side: tiny code chip on the color block */}
        <div className="absolute top-3 left-3 text-[9px] tracking-[0.12em] uppercase font-bold text-white/85">{obra.code}</div>
        {obra.starred && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" className="absolute bottom-3 left-3">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        )}
      </div>
    );
  }

  // Default: blueprint
  return (
    <div className="relative w-full overflow-hidden rounded-t-lg" style={{ height, background: obra.color }}>
      <svg viewBox="0 0 220 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-30">
        {[...Array(8)].map((_, i) => (
          <line key={'h'+i} x1="0" x2="220" y1={i*14} y2={i*14} stroke="#ffffff" strokeWidth="0.6"/>
        ))}
        {[...Array(16)].map((_, i) => (
          <line key={'v'+i} x1={i*14} x2={i*14} y1="0" y2="100" stroke="#ffffff" strokeWidth="0.6"/>
        ))}
      </svg>
      <svg viewBox="0 0 60 40" className="absolute inset-0 m-auto w-[60px] h-[40px] opacity-95">
        <rect x="6"  y="22" width="9" height="14" rx="1.5" fill="#FFFFFF" fillOpacity="0.85"/>
        <rect x="20" y="14" width="9" height="22" rx="1.5" fill="#FFFFFF"/>
        <rect x="34" y="4"  width="9" height="32" rx="1.5" fill="#F59E0B"/>
        {obra.id === 'casa-tigre' && (
          <circle cx="50" cy="8" r="5" fill="#22C55E"/>
        )}
      </svg>
      {obra.starred && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/40 to-transparent flex items-center gap-2">
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${obra.progress}%` }}/>
        </div>
        <div className="text-[10px] font-bold text-white tnum">{obra.progress}%</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Obra cards — grid view + list row
// ---------------------------------------------------------------------------

const ObraCard = ({ obra, cover = 'blueprint' }) => {
  const s = STATUS[obra.status];
  return (
    <a href="Dashboard.html" className="obra-card group bg-white border border-slate200 rounded-lg overflow-hidden shadow-card hover:shadow-pop hover:border-primary transition-all">
      <ObraThumb obra={obra} height={104} variant={cover} />
      <div className="p-4 obra-card-body">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="text-[14px] font-extrabold text-slate950 leading-tight group-hover:text-primary transition-colors">{obra.name}</div>
          <button className="text-slate400 hover:text-slate700 -mt-1 -mr-1 p-1" onClick={(e) => { e.preventDefault(); }}>
            <Icon name="more" size={14} />
          </button>
        </div>
        <div className="text-[11px] text-slate500 leading-snug truncate">{obra.address}</div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <DPill tone={s.tone}>{s.label}</DPill>
          {obra.alerts > 0 && <DPill tone="criticalSolid">{obra.alerts} alerta{obra.alerts > 1 ? 's' : ''}</DPill>}
        </div>

        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate100">
          <div className="flex -space-x-2">
            {obra.team.slice(0, 4).map((t) => (
              <div key={t} className="ring-2 ring-white rounded-full">
                <DAvatar initials={t} size={22} />
              </div>
            ))}
            {obra.team.length > 4 && (
              <div className="w-[22px] h-[22px] rounded-full bg-slate100 text-slate600 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                +{obra.team.length - 4}
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate500 truncate">{obra.lastActivity}</div>
        </div>
      </div>
    </a>
  );
};

const ObraRow = ({ obra }) => {
  const s = STATUS[obra.status];
  return (
    <a href="Dashboard.html" className="group grid grid-cols-[40px_1fr_140px_120px_180px_100px_24px] items-center gap-4 py-3 px-4 hover:bg-slate50 transition-colors border-b border-slate100 last:border-b-0">
      <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: obra.color + '20' }}>
        <svg width="18" height="14" viewBox="0 0 60 40">
          <rect x="6"  y="22" width="9" height="14" rx="1.5" fill={obra.color} opacity="0.6"/>
          <rect x="20" y="14" width="9" height="22" rx="1.5" fill={obra.color} opacity="0.85"/>
          <rect x="34" y="4"  width="9" height="32" rx="1.5" fill={obra.color}/>
        </svg>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-[13px] font-bold text-slate950 truncate group-hover:text-primary">{obra.name}</div>
          {obra.starred && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B">
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          )}
        </div>
        <div className="text-[11px] text-slate500 truncate">{obra.address} · {obra.type}</div>
      </div>
      <div>
        <DPill tone={s.tone}>{s.label}</DPill>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-[6px] bg-slate100 rounded-full overflow-hidden max-w-[80px]">
          <div className="h-full rounded-full" style={{ width: `${obra.progress}%`, background: obra.color }}/>
        </div>
        <div className="text-[11px] font-bold tnum w-[34px] text-right">{obra.progress}%</div>
      </div>
      <div className="text-[11px] text-slate600 truncate">{obra.lastActivityWho}</div>
      <div className="flex -space-x-2 justify-end">
        {obra.team.slice(0, 3).map((t) => (
          <div key={t} className="ring-2 ring-white rounded-full">
            <DAvatar initials={t} size={22} />
          </div>
        ))}
      </div>
      <button className="text-slate400 hover:text-slate700 p-1" onClick={(e) => { e.preventDefault(); }}>
        <Icon name="more" size={14} />
      </button>
    </a>
  );
};

// ---------------------------------------------------------------------------
// Sidebar (workspace-level — different from per-obra dashboard sidebar)
// ---------------------------------------------------------------------------

const WORKSPACE_NAV = [
  { id: 'inicio',      label: 'Inicio',             icon: 'grid',     badge: null },
  { id: 'obras',       label: 'Mis obras',          icon: 'package',  badge: 4 },
  { id: 'compartidas', label: 'Compartidas conmigo', icon: 'users',   badge: null },
  { id: 'archivos',    label: 'Archivos',           icon: 'database', badge: null },
  { id: 'destacadas',  label: 'Destacadas',         icon: 'sparkle',  badge: null },
  { id: 'plantillas',  label: 'Plantillas',         icon: 'calendar', badge: null },
];

const WORKSPACE_NAV_BOTTOM = [
  { id: 'archivadas', label: 'Archivadas', icon: 'check-circle' },
  { id: 'papelera',   label: 'Papelera',    icon: 'x' },
];

const WorkspaceSidebar = ({ current, onNav, onNewObra, mood = 'focused' }) => {
  // Two distinct moods that fully recolor the nav.
  const T = mood === 'bright' ? {
    aside:        'bg-paper border-r border-slate200 text-slate800',
    brand:        'text-slate950',
    newBtn:       'bg-primary hover:bg-primary-700 text-white',
    navItem:      'text-slate600 hover:bg-slate100 hover:text-slate950',
    navItemOn:    'bg-primary-50 text-primary',
    navIcon:      'text-slate500',
    navIconOn:    'text-primary',
    rail:         'bg-primary',
    divider:      'border-slate200',
    bottomItem:   'text-slate500 hover:bg-slate100 hover:text-slate950',
    bottomIcon:   'text-slate400',
    storageWrap:  'bg-white border border-slate200',
    storageLabel: 'text-slate500',
    storageBar:   'bg-slate200',
    storageFill:  'bg-accent',
    storageText:  'text-slate600',
    storageLink:  'text-primary',
    footer:       'border-t border-slate200',
    footerName:   'text-slate950',
    footerRole:   'text-slate500',
    footerArrow:  'text-slate400 hover:text-slate700',
    badge:        'bg-primary-50 text-primary',
  } : {
    aside:        'bg-ink-deep text-white',
    brand:        'text-white',
    newBtn:       'bg-accent hover:bg-accent-700 text-slate950',
    navItem:      'text-white/70 hover:bg-white/[0.06] hover:text-white',
    navItemOn:    'bg-white/10 text-white',
    navIcon:      'text-white/55',
    navIconOn:    'text-accent',
    rail:         'bg-accent',
    divider:      'border-white/10',
    bottomItem:   'text-white/60 hover:bg-white/[0.06] hover:text-white',
    bottomIcon:   'text-white/45',
    storageWrap:  'bg-white/[0.05]',
    storageLabel: 'text-white/50',
    storageBar:   'bg-white/10',
    storageFill:  'bg-accent',
    storageText:  'text-white/60',
    storageLink:  'text-accent',
    footer:       'border-t border-white/10',
    footerName:   'text-white',
    footerRole:   'text-white/55',
    footerArrow:  'text-white/55 hover:text-white',
    badge:        'bg-white/20 text-white',
  };

  return (
  <aside className={`w-[240px] flex flex-col flex-none ${T.aside}`}>
    <div className="px-4 py-4 flex items-center gap-[10px]">
      <Icon name="logo-mark" size={28} />
      <div className={`font-extrabold text-[16px] display-tight ${T.brand}`}>BuildData</div>
    </div>

    <div className="px-3 pb-3">
      <button onClick={onNewObra} className={`w-full font-bold text-[12px] rounded-md px-3 py-[10px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${T.newBtn}`}>
        <Icon name="plus" size={14} /> Nueva obra
      </button>
    </div>

    <nav className="px-3 flex-1 flex flex-col gap-1">
      {WORKSPACE_NAV.map((s) => {
        const on = current === s.id;
        return (
          <button key={s.id} onClick={() => onNav(s.id)}
            className={`relative flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-left transition-colors
              ${on ? T.navItemOn : T.navItem}`}>
            {on && <span className={`absolute -left-3 top-[8px] bottom-[8px] w-[3px] rounded ${T.rail}`} />}
            <span className={on ? T.navIconOn : T.navIcon}>
              <Icon name={s.icon} size={16} />
            </span>
            <span className="flex-1">{s.label}</span>
            {s.badge && (
              <span className={`text-[9px] font-bold px-[6px] py-[1.5px] rounded-full ${T.badge}`}>{s.badge}</span>
            )}
          </button>
        );
      })}

      <div className={`border-t my-3 ${T.divider}`} />

      {WORKSPACE_NAV_BOTTOM.map((s) => (
        <button key={s.id} onClick={() => onNav(s.id)}
          className={`flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[12px] font-semibold text-left transition-colors ${T.bottomItem}`}>
          <span className={T.bottomIcon}><Icon name={s.icon} size={16} /></span>
          <span className="flex-1">{s.label}</span>
        </button>
      ))}

      {/* Storage usage */}
      <div className={`mt-auto rounded-lg p-3 mt-4 mb-2 ${T.storageWrap}`}>
        <div className={`text-[9px] tracking-[0.06em] uppercase font-bold mb-2 ${T.storageLabel}`}>Almacenamiento</div>
        <div className={`h-[5px] rounded-full overflow-hidden mb-2 ${T.storageBar}`}>
          <div className={`h-full rounded-full ${T.storageFill}`} style={{ width: '42%' }}/>
        </div>
        <div className={`text-[10px] ${T.storageText}`}>8,4 GB de 20 GB</div>
        <button className={`text-[10px] font-bold mt-2 hover:underline ${T.storageLink}`}>Ampliar plan →</button>
      </div>
    </nav>

    <div className={`p-3 flex items-center gap-[10px] ${T.footer}`}>
      <DAvatar initials="JM" size={30} />
      <div className="flex-1 min-w-0">
        <div className={`text-[12px] font-bold ${T.footerName}`}>J. Méndez</div>
        <div className={`text-[10px] ${T.footerRole}`}>Director de obra</div>
      </div>
      <a href="Perfil.html" className={T.footerArrow}><Icon name="chevron-right" size={14} /></a>
    </div>
  </aside>
  );
};

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------

const WorkspaceTopBar = ({ query, onQuery }) => (
  <header className="h-[58px] px-6 border-b border-slate200 bg-white flex items-center gap-3 flex-none">
    <div className="flex-1 max-w-[480px] flex items-center gap-2 bg-slate50 border border-slate200 rounded-md px-3 py-[8px] text-[13px] text-slate500 focus-within:border-primary transition-colors">
      <Icon name="search" size={15} />
      <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Buscar obras, archivos, personas…"
        className="flex-1 bg-transparent border-0 outline-none text-slate950 placeholder:text-slate500" />
      <span className="bg-white border border-slate200 text-[10px] font-bold px-[5px] py-[1px] rounded text-slate500">⌘K</span>
    </div>
    <div className="flex-1" />
    <button className="w-9 h-9 rounded-md border border-slate200 bg-white text-slate600 flex items-center justify-center hover:bg-slate50">
      <Icon name="info" size={15} />
    </button>
    <button className="w-9 h-9 rounded-md border border-slate200 bg-white text-slate600 flex items-center justify-center relative hover:bg-slate50">
      <Icon name="bell" size={15} />
      <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-critical border-2 border-white" />
    </button>
    <DAvatar initials="JM" size={32} />
  </header>
);

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

const ObrasHome = ({ cover = 'blueprint', mood = 'focused', density = 'regular' } = {}) => {
  const [view, setView] = React.useState('grid'); // grid | list
  const [filter, setFilter] = React.useState('todas');
  const [sort, setSort] = React.useState('reciente');
  const [tab, setTab] = React.useState('inicio');
  const [query, setQuery] = React.useState('');
  const [newObraOpen, setNewObraOpen] = React.useState(false);

  const filters = [
    { id: 'todas',         label: 'Todas',         match: () => true },
    { id: 'en-curso',      label: 'En curso',      match: (o) => o.status === 'en-curso' },
    { id: 'planificacion', label: 'Planificación', match: (o) => o.status === 'planificacion' },
    { id: 'pausada',       label: 'Pausadas',      match: (o) => o.status === 'pausada' },
    { id: 'finalizada',    label: 'Finalizadas',   match: (o) => o.status === 'finalizada' },
  ];
  const activeFilter = filters.find((f) => f.id === filter) || filters[0];
  const filtered = OBRAS
    .filter(activeFilter.match)
    .filter((o) => !query || o.name.toLowerCase().includes(query.toLowerCase()) || o.address.toLowerCase().includes(query.toLowerCase()));

  const recientes = OBRAS.filter((o) => o.status !== 'finalizada').slice(0, 4);
  const totals = {
    activas: OBRAS.filter((o) => o.status === 'en-curso').length,
    alertas: OBRAS.reduce((s, o) => s + o.alerts, 0),
    pedidos: OBRAS.reduce((s, o) => s + o.pedidos, 0),
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div data-density={density} style={{ height: '100vh' }} className="obras-root flex bg-paper overflow-hidden">
      <WorkspaceSidebar current={tab} onNav={setTab} onNewObra={() => setNewObraOpen(true)} mood={mood} />
      <div className="flex-1 min-w-0 flex flex-col">
        <WorkspaceTopBar query={query} onQuery={setQuery} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1240px] mx-auto px-8 py-8">

            {/* Greeting */}
            <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
              <div>
                <h1 className="text-[28px] font-extrabold display-tight text-slate950 leading-tight">{greeting}, Juan</h1>
                <p className="text-[13px] text-slate500 mt-1">Tenés <b className="text-slate950">{totals.activas} obras en curso</b>, <b className="text-[#B91C1C]">{totals.alertas} alertas activas</b> y <b className="text-[#A16207]">{totals.pedidos} pedidos pendientes</b>.</p>
              </div>
              <div className="flex gap-2 flex-none">
                <DButton variant="secondary" size="md" icon={<Icon name="download" size={13} />} className="whitespace-nowrap">Reporte global</DButton>
                <DButton variant="primary" size="md" icon={<Icon name="plus" size={13} />} className="whitespace-nowrap" onClick={() => setNewObraOpen(true)}>Nueva obra</DButton>
              </div>
            </div>

            {/* Acceso rápido */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] tracking-[0.08em] uppercase font-bold text-slate500">Acceso rápido</div>
                <button className="text-[11px] font-bold text-primary hover:underline">Ver todas →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {recientes.map((o) => {
                  const s = STATUS[o.status];
                  return (
                    <a key={o.id} href="Dashboard.html" className="group bg-white border border-slate200 rounded-lg p-4 flex gap-3 hover:border-primary hover:shadow-card2 transition-all">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center flex-none" style={{ background: o.color + '20' }}>
                        <svg width="18" height="14" viewBox="0 0 60 40">
                          <rect x="6"  y="22" width="9" height="14" rx="1.5" fill={o.color} opacity="0.6"/>
                          <rect x="20" y="14" width="9" height="22" rx="1.5" fill={o.color} opacity="0.85"/>
                          <rect x="34" y="4"  width="9" height="32" rx="1.5" fill={o.color}/>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-bold text-slate950 truncate group-hover:text-primary">{o.name}</div>
                        <div className="text-[10px] text-slate500 truncate">{o.lastActivity} · {o.progress}%</div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="w-[6px] h-[6px] rounded-full" style={{ background: s.dot }} />
                          <span className="text-[10px] font-bold text-slate600">{s.label}</span>
                          {o.alerts > 0 && (
                            <span className="ml-auto text-[9px] font-bold bg-critical text-white px-[5px] py-[1px] rounded">
                              {o.alerts} ⚠
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Todas tus obras */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <div className="text-[11px] tracking-[0.08em] uppercase font-bold text-slate500">Todas tus obras · {filtered.length}</div>

                <div className="flex items-center gap-2">
                  {/* Filters */}
                  <div className="flex gap-1">
                    {filters.map((f) => (
                      <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`text-[11px] font-bold px-3 py-[6px] rounded-full border transition-colors
                          ${filter === f.id ? 'bg-primary-50 text-primary border-primary' : 'bg-white text-slate600 border-slate200 hover:border-slate300'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="w-px h-5 bg-slate200 mx-1" />
                  {/* Sort */}
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="text-[11px] font-semibold bg-white border border-slate200 rounded-md px-2 py-[6px] focus:outline-none focus:border-primary">
                    <option value="reciente">Más reciente</option>
                    <option value="nombre">Por nombre</option>
                    <option value="avance">Por avance</option>
                  </select>
                  {/* View toggle */}
                  <div className="flex bg-slate100 rounded-md p-[2px]">
                    <button onClick={() => setView('grid')}
                      className={`p-[6px] rounded ${view === 'grid' ? 'bg-white shadow-card text-slate950' : 'text-slate500'}`}>
                      <Icon name="grid" size={14} />
                    </button>
                    <button onClick={() => setView('list')}
                      className={`p-[6px] rounded ${view === 'list' ? 'bg-white shadow-card text-slate950' : 'text-slate500'}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {view === 'grid' ? (
                <div className="obras-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((o) => <ObraCard key={o.id} obra={o} cover={cover} />)}
                </div>
              ) : (
                <DCard padding="p-0" className="overflow-hidden">
                  <div className="grid grid-cols-[40px_1fr_140px_120px_180px_100px_24px] items-center gap-4 px-4 py-2 bg-slate50 border-b border-slate200 text-[9px] tracking-[0.06em] uppercase font-bold text-slate500">
                    <div></div>
                    <div>Nombre</div>
                    <div>Estado</div>
                    <div>Avance</div>
                    <div>Última actividad</div>
                    <div className="text-right">Equipo</div>
                    <div></div>
                  </div>
                  {filtered.map((o) => <ObraRow key={o.id} obra={o} />)}
                </DCard>
              )}

              {filtered.length === 0 && (
                <div className="text-center text-slate500 py-12 text-[13px] border border-dashed border-slate200 rounded-lg">
                  No hay obras que coincidan con tu búsqueda.
                </div>
              )}
            </section>

            {/* Archivos recientes */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] tracking-[0.08em] uppercase font-bold text-slate500">Archivos recientes</div>
                <button className="text-[11px] font-bold text-primary hover:underline">Ver todos →</button>
              </div>
              <DCard padding="p-0">
                {FILES.map((f, i) => (
                  <div key={f.name} className={`grid grid-cols-[44px_1fr_180px_100px_70px_24px] gap-4 items-center px-4 py-[10px] hover:bg-slate50 cursor-pointer
                    ${i < FILES.length - 1 ? 'border-b border-slate100' : ''}`}>
                    <FileIcon kind={f.kind} size={28} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-slate950 truncate">{f.name}</div>
                    </div>
                    <div className="text-[11px] text-slate600 truncate">{f.obra}</div>
                    <div className="text-[11px] text-slate500">{f.when}</div>
                    <div className="text-[11px] text-slate500 tnum text-right">{f.size}</div>
                    <button className="text-slate400 hover:text-slate700 p-1"><Icon name="more" size={14} /></button>
                  </div>
                ))}
              </DCard>
            </section>

          </div>
        </main>
      </div>

      <NuevaObraModal open={newObraOpen} onClose={() => setNewObraOpen(false)} />
    </div>
  );
};

Object.assign(window, { ObrasHome });
