import { Star, Check, ArrowRight, StarFill, CheckDouble } from "@gravity-ui/icons";
import PricingCard from "../components/PricingCard";
import PricingToggle from "../components/PricingToggle";
import CompareTable from "../components/CompareTable";
import FAQ from "../components/FAQ";
import Footer from "./Footer";

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="12" fill="#0F4395" />
      <rect x="11" y="30" width="9" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.85" />
      <rect x="23" y="20" width="9" height="28" rx="2" fill="#FFFFFF" />
      <rect x="35" y="10" width="9" height="38" rx="2" fill="#F59E0B" />
    </svg>
  );
}

const pricingCards = [
  {
    planLabel: "Inicio",
    labelColor: "#0F4395",
    title: "Para probar BuildData o para una sola obra chica.",
    price: "Gratis",
    priceSub: "14 días sin tarjeta · luego AR$ 0 / mes",
    idealFor: "Profesionales independientes que arrancan con BuildData.",
    ctaText: "Empezar gratis",
    ctaHref: "/login",
    features: [
      { text: "1 obra activa", included: true },
      { text: "Hasta 5 personas en el equipo", included: true },
      { text: "Bot de WhatsApp con 100 mensajes/mes", included: true },
      { text: "Cronograma y alertas básicas", included: true },
      { text: "Almacenamiento 1 GB", included: true },
      { text: "Análisis IA y resúmenes diarios", included: false },
      { text: "Reportes exportables (PDF/XLSX)", included: false },
      { text: "Integraciones con ERP", included: false },
    ],
  },
  {
    planLabel: "Profesional",
    labelColor: "#F59E0B",
    title: "Lo más elegido — para constructoras pequeñas y medianas.",
    price: "AR$ 71.000",
    priceSub: "Facturado anualmente · ahorrás AR$ 216.000 al año",
    idealFor: "Constructoras con 2 a 5 obras simultáneas.",
    ctaText: "Probar 14 días gratis",
    ctaHref: "/login?plan=pro",
    isFeatured: true,
    badge: "★ Más elegido",
    features: [
      { text: "Hasta 3 obras activas", included: true, bold: true },
      { text: "Hasta 20 personas por obra", included: true, bold: true },
      { text: "Bot de WhatsApp con mensajes ilimitados", included: true },
      { text: "Cronograma, alertas y pedidos completos", included: true },
      { text: "Análisis IA y resúmenes diarios", included: true, bold: true },
      { text: "Reportes exportables (PDF/XLSX)", included: true },
      { text: "Almacenamiento 20 GB", included: true },
      { text: "Soporte prioritario por WhatsApp", included: true },
      { text: "Integraciones con ERP (Tango, SAP)", included: false },
    ],
  },
  {
    planLabel: "Empresa",
    labelColor: "#0F4395",
    title: "Para constructoras que gestionan muchas obras a la vez.",
    price: "AR$ 151.000",
    priceSub: "Facturado anualmente · ahorrás AR$ 456.000 al año",
    idealFor: "Constructoras con 6+ obras o gerencias multi-proyecto.",
    ctaText: "Probar 14 días gratis",
    ctaHref: "/login?plan=empresa",
    features: [
      { text: "Obras ilimitadas", included: true, bold: true },
      { text: "Equipos ilimitados", included: true, bold: true },
      { text: "Bot de WhatsApp con mensajes ilimitados", included: true },
      { text: "Todo lo del plan Profesional", included: true },
      { text: "Integraciones con ERP (Tango, SAP, custom)", included: true, bold: true },
      { text: "Dashboard consolidado multi-obra", included: true, bold: true },
      { text: "Almacenamiento 200 GB", included: true },
      { text: "Manager de cuenta dedicado", included: true },
      { text: "Onboarding con tu equipo", included: true },
    ],
  },
];

const comparisonCategories = [
  {
    name: "Equipo y obras",
    features: [
      { name: "Obras simultáneas", values: ["1", "3", "Ilimitadas"] },
      { name: "Personas por obra", values: ["5", "20", "Ilimitadas"] },
      { name: "Roles personalizados", values: [false, true, true] },
      { name: "Sectores por obra", values: ["3", "10", "Ilimitados"] },
    ],
  },
  {
    name: "Bot de WhatsApp",
    features: [
      { name: "Mensajes al mes", values: ["100", "Ilimitados", "Ilimitados"] },
      { name: "Transcripción de audios", values: [true, true, true] },
      { name: "Clasificación automática por IA", values: ["Básica", "Completa", "Completa + custom"] },
      { name: "Múltiples números de WhatsApp", values: [false, false, true] },
    ],
  },
  {
    name: "Análisis e IA",
    features: [
      { name: "Resumen diario por IA", values: [false, true, true] },
      { name: "Predicción de retrasos", values: [false, true, true] },
      { name: "Consultas en lenguaje natural", values: [false, true, true] },
      { name: "Modelos entrenados con tus datos", values: [false, false, true] },
    ],
  },
  {
    name: "Reportes y exportación",
    features: [
      { name: "Reportes en pantalla", values: [true, true, true] },
      { name: "Exportar PDF / XLSX", values: [false, true, true] },
      { name: "Reportes programados por email", values: [false, true, true] },
      { name: "API y webhooks", values: [false, false, true] },
    ],
  },
  {
    name: "Integraciones",
    features: [
      { name: "Excel / Google Sheets", values: [true, true, true] },
      { name: "Slack / Microsoft Teams", values: [false, true, true] },
      { name: "ERP (Tango, SAP, etc.)", values: [false, false, true] },
      { name: "Integraciones a medida", values: [false, false, true] },
    ],
  },
  {
    name: "Soporte",
    features: [
      { name: "Centro de ayuda", values: [true, true, true] },
      { name: "Soporte por email", values: ["48 hs", "24 hs", "4 hs"] },
      { name: "Soporte por WhatsApp", values: [false, true, true] },
      { name: "Manager de cuenta dedicado", values: [false, false, true] },
    ],
  },
];

const faqItems = [
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Sí. Subir de plan es instantáneo y solo pagás la diferencia prorrateada hasta el próximo ciclo. Bajar de plan se aplica al inicio del siguiente período. Cancelar también lo podés hacer cuando quieras desde Configuración.",
  },
  {
    question: "¿Qué pasa cuando termina la prueba gratis de 14 días?",
    answer:
      "Si no elegís un plan pago, tu cuenta pasa automáticamente al plan Inicio (gratuito) con todas sus funcionalidades. Nunca perdés tu información. Siempre podés actualizar a un plan pago cuando lo necesites.",
  },
  {
    question: "¿Cobran por persona del equipo?",
    answer:
      "No. Todos nuestros planes tienen costo fijo por obra, sin importar cuántas personas agregues al equipo. Podés invitar a tu capataz, ingenieros, clientes y proveedores sin costos adicionales.",
  },
  {
    question: "¿Cómo funciona la facturación anual?",
    answer:
      "Elegís facturación anual y te ahorrás el equivalente a 2 meses de facturación. El cobro es una vez al año, al inicio del período. Podés cambiar a facturación mensual en cualquier renovación.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Sí. Usamos encriptación de extremo a extremo, servidores en la nube con certificaciones ISO 27001, y hacemos backups diarios. Tus datos nunca se comparten con terceros.",
  },
  {
    question: "¿Tienen descuentos para estudios chicos o cooperativas?",
    answer:
      "Sí. Tenemos planes especiales para cooperativas de trabajo, estudios pequeños y organizaciones sin fines de lucro. Escribinos a hola@buildata.app y te armamos una propuesta.",
  },
];

export default function PlanesPage() {
  return (
    <div>
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-slate200">
        <div className="max-w-[1240px] mx-auto px-6 h-[68px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <LogoIcon />
            <span className="text-[18px] font-extrabold display-tight">BuildData</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-slate600">
            <a href="/" className="hover:text-primary">Producto</a>
            <a href="/payments" className="text-primary">Planes</a>
            <a href="/#casos" className="hover:text-primary">Casos</a>
            <a href="/#contacto" className="hover:text-primary">Contacto</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/login" className="text-[13px] font-bold text-slate700 hover:text-primary px-3 py-2">
              Iniciar sesión
            </a>
            <a
              href="/login"
              className="text-[13px] font-bold bg-primary hover:bg-primary-700 text-white rounded-md px-4 py-[8px] transition-colors"
            >
              Probar gratis
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-grid relative">
        <div className="max-w-[1240px] mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary border border-primary/15 rounded-full px-3 py-[5px] text-[10px] tracking-[0.12em] uppercase font-bold mb-5">
            <StarFill />
            Sin tarjeta · cancelás cuando quieras
          </div>
          <h1 className="text-[clamp(36px,5vw,56px)] leading-[1.05] font-extrabold display-tight max-w-[820px] mx-auto">
            Un plan para cada tipo de obra.
            <br />
            <span className="text-primary">Sin sorpresas, sin contratos largos.</span>
          </h1>
          <p className="text-[16px] text-slate600 leading-relaxed max-w-[640px] mx-auto mt-5">
            Probá gratis durante 14 días. Cuando estés convencido elegís el plan que más se ajuste a tu volumen de obra — y lo cambiás cuando crezcas.
          </p>
          <PricingToggle />
        </div>
      </section>

      {/* Pricing cards + Enterprise + Trust */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {pricingCards.map((card) => (
            <PricingCard key={card.planLabel} {...card} />
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-paper border-2 border-dashed border-slate300 rounded-2xl p-7 grid grid-cols-1 lg:grid-cols-[2fr_1fr_auto] gap-6 items-center mt-6">
          <div>
            <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-accent-700 mb-1">
              Enterprise
            </div>
            <h3 className="text-[22px] font-extrabold display-tight leading-tight">
              ¿Sos una desarrolladora grande o un grupo constructor?
            </h3>
            <p className="text-[13px] text-slate600 leading-relaxed mt-2 max-w-[520px]">
              Armamos un plan a medida con SSO, residencia de datos, integraciones específicas y SLAs definidos por contrato. Onboarding asistido por nuestro equipo.
            </p>
          </div>
          <div className="text-[13px] text-slate700 leading-relaxed">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckDouble className="text-success" /> SSO con tu Active Directory
              </li>
              <li className="flex items-center gap-2">
                <CheckDouble className="text-success" /> Residencia de datos en AR/UY/CL
              </li>
              <li className="flex items-center gap-2">
                <CheckDouble className="text-success" /> SLA del 99.95 %
              </li>
              <li className="flex items-center gap-2">
                <CheckDouble className="text-success" /> Onboarding y capacitación
              </li>
              <li className="flex items-center gap-2">
                <CheckDouble className="text-success" /> Soporte 24/7
              </li>
            </ul>
          </div>
          <a
            href="mailto:enterprise@buildata.app"
            className="inline-flex items-center justify-center gap-2 bg-slate950 hover:bg-ink-deep text-white font-bold rounded-md px-5 py-[12px] text-[13px] transition-colors whitespace-nowrap"
          >
            Hablar con ventas <ArrowRight />
          </a>
        </div>

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-6 mt-8 text-[12px] text-slate500 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <CheckDouble className="text-success" /> Sin tarjeta para empezar
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckDouble className="text-success" /> Cancelás cuando quieras
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckDouble className="text-success" /> Migración asistida sin costo
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-slate200">
        <div className="max-w-[1100px] mx-auto px-6 py-12 text-center">
          <div className="text-[10px] tracking-[0.18em] uppercase font-bold text-slate500 mb-6">
            Más de 120 constructoras ya usan BuildData
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[860px] mx-auto">
            <StatItem value="120+" label="constructoras" />
            <StatItem value="14 K" label="reportes / mes" />
            <StatItem value="92 %" label="transcripciones correctas" />
            <StatItem value="4 h" label="ahorradas por día" />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.18em] uppercase font-bold text-primary mb-2">
            Comparación detallada
          </div>
          <h2 className="text-[28px] font-extrabold display-tight">
            Todo lo que incluye cada plan
          </h2>
        </div>
        <CompareTable categories={comparisonCategories} />
        <div className="text-center mt-6 text-[12px] text-slate500">
          ¿No estás seguro cuál te conviene?{" "}
          <a href="mailto:hola@buildata.app" className="text-primary font-bold hover:underline">
            Hablá con nosotros
          </a>{" "}
          y te ayudamos a elegir.
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[860px] mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.18em] uppercase font-bold text-primary mb-2">
            Preguntas frecuentes
          </div>
          <h2 className="text-[28px] font-extrabold display-tight">
            Lo que más nos preguntan
          </h2>
        </div>
        <FAQ items={faqItems} />
        <div className="text-center mt-6 text-[13px] text-slate500">
          ¿Otra duda? Escribinos a{" "}
          <a href="mailto:hola@buildata.app" className="text-primary font-bold hover:underline">
            hola@buildata.app
          </a>
          .
        </div>
      </section>

      {/* CTA final */}
      <section className="blueprint-bg relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 py-20 text-center text-white relative z-10">
          <h2 className="text-[clamp(28px,4vw,44px)] leading-[1.1] font-extrabold display-tight mb-4 max-w-[760px] mx-auto">
            <span style={{ color: "#FFFFFF" }}>Probá BuildData en tu obra.</span>
            <br />
            <span className="text-accent">En 24 horas tu información va a estar ordenada.</span>
          </h2>
          <p className="text-[15px] text-white/70 max-w-[540px] mx-auto leading-relaxed mb-8">
            Sin tarjeta de crédito. Sin contratos largos. Sin instalaciones complicadas.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-700 text-slate950 font-bold rounded-md px-6 py-[12px] text-[14px] transition-colors"
            >
              Empezar 14 días gratis <ArrowRight />
            </a>
            <a
              href="mailto:hola@buildata.app"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-md px-6 py-[12px] text-[14px] transition-colors"
            >
              Agendar una demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[32px] font-extrabold display-tight tnum text-slate950">
        {value}
      </div>
      <div className="text-[11px] tracking-[0.06em] uppercase font-bold text-slate500 mt-1">
        {label}
      </div>
    </div>
  );
}
