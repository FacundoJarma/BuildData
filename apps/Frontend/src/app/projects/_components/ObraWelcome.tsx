export default function WelcomeHero({ greeting, timeIcon, totals, onNewObra, onReport, dateLabel }: any){
  <div className="welcome-hero relative overflow-hidden rounded-2xl mb-7 text-white">
    {/* Decorative layers */}
    <div className="wh-orb wh-orb-1" />
    <div className="wh-orb wh-orb-2" />
    <div className="wh-grid" />
    {/* Faint skyline silhouette */}
    <svg className="absolute bottom-0 right-0 h-[120px] w-auto opacity-[0.13] pointer-events-none" viewBox="0 0 320 120" fill="none" preserveAspectRatio="xMaxYMax meet">
      <rect x="6"   y="64" width="30" height="56" fill="#fff"/>
      <rect x="44"  y="40" width="34" height="80" fill="#fff"/>
      <rect x="86"  y="78" width="26" height="42" fill="#fff"/>
      <rect x="120" y="20" width="36" height="100" fill="#fff"/>
      <rect x="120" y="20" width="36" height="14" fill="#F59E0B"/>
      <rect x="164" y="56" width="30" height="64" fill="#fff"/>
      <rect x="202" y="34" width="34" height="86" fill="#fff"/>
      <rect x="244" y="70" width="26" height="50" fill="#fff"/>
      <rect x="278" y="48" width="34" height="72" fill="#fff"/>
      {/* crane */}
      <path d="M150 20 L150 4 L210 4 M150 10 L168 4" stroke="#F59E0B" strokeWidth="2"/>
    </svg>
    <div className="wh-fade" />

    <div className="relative z-10 px-7 py-7 sm:px-9 sm:py-8">
      {/* Date + greeting row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-[6px] bg-white/10 backdrop-blur text-white/80 text-[10px] font-bold tracking-[0.08em] uppercase px-[10px] py-[5px] rounded-full">
          <span className="w-[6px] h-[6px] rounded-full bg-success wh-pulse" />
          {dateLabel}
        </span>
      </div>

      <div className="flex items-start gap-3 mb-1">
        <span className="text-[34px] leading-none mt-[2px] select-none">{"\n"}</span>
        <div>
          <h1 className="text-[clamp(26px,3vw,36px)] font-extrabold display-tight leading-[1.05]">
            <span style={{ color: "#ffffff" }}>{greeting}</span><span style={{ color: "#ffffff" }}>,</span> <span className="text-accent">Juan</span>
          </h1>
          <p className="text-[13px] sm:text-[14px] text-white/70 mt-1 leading-snug max-w-[520px]">
            Tenés un buen panorama hoy. Esto es lo que está pasando en tus obras.
          </p>
        </div>
      </div>

      {/* Live stat pills */}
      <div className="flex flex-wrap gap-2 mt-5">
        <div className="wh-pill">
          <span className="wh-pill-ico" style={{ background: 'rgba(34,197,94,0.18)', color: '#86EFAC' }}>
            <Icon name="package" size={14} />
          </span>
          <span><b className="tnum">{totals.activas}</b> obras en curso</span>
        </div>
        <div className="wh-pill">
          <span className="wh-pill-ico" style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
            <Icon name="alert" size={14} />
          </span>
          <span><b className="tnum">{totals.alertas}</b> alertas activas</span>
        </div>
        <div className="wh-pill">
          <span className="wh-pill-ico" style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D' }}>
            <Icon name="truck" size={14} />
          </span>
          <span><b className="tnum">{totals.pedidos}</b> pedidos pendientes</span>
        </div>
      </div>
    </div>
  </div>
}