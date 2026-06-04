export default function ConstructionIllustration() {
  return (
<svg viewBox="0 0 280 220" className="w-full h-auto drop-shadow-[0_20px_40px_rgba(15,23,42,0.12)]" xmlns="http://www.w3.org/2000/svg">
  <style>{`
    @keyframes craneSwing {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes hookBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(8px); }
    }
    @keyframes constructionSpark {
      0%, 60%, 100% { opacity: 0; }
      30% { opacity: 1; }
    }
    .crane-arm { transform-origin: 100px 90px; animation: craneSwing 6s ease-in-out infinite; }
    .crane-hook { animation: hookBob 6s ease-in-out infinite; }
    .construction-spark { animation: constructionSpark 3s ease-in-out infinite; }
    .construction-spark.s2 { animation-delay: 1s; }
    .construction-spark.s3 { animation-delay: 2s; }
  `}</style>

  <circle className="construction-spark" cx="40" cy="48" r="2" fill="#F59E0B" />
  <circle className="construction-spark s2" cx="240" cy="38" r="2" fill="#0F4395" />
  <circle className="construction-spark s3" cx="200" cy="62" r="2" fill="#F59E0B" />

  <line x1="10" y1="190" x2="270" y2="190" stroke="#CBD5E1" strokeWidth="1.5" />

  <rect x="80" y="140" width="28" height="50" rx="3" fill="#FFFFFF" stroke="#0F4395" strokeWidth="1.5" />
  <rect x="118" y="115" width="28" height="75" rx="3" fill="#0F4395" />
  <rect x="156" y="80" width="28" height="110" rx="3" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />

  <rect x="206" y="60" width="6" height="130" fill="#131B2E" />
  <polygon points="195,190 223,190 215,180 203,180" fill="#131B2E" />

  <g className="crane-arm">
    <rect x="170" y="58" width="40" height="5" fill="#131B2E" />
    <line x1="209" y1="60" x2="100" y2="60" stroke="#131B2E" strokeWidth="3" strokeLinecap="round" />
    <path d="M209 60 L195 50 L185 60 L175 50 L165 60 L155 50 L145 60 L135 50 L125 60 L115 50 L105 60" stroke="#131B2E" strokeWidth="1.2" fill="none" />
    <rect x="205" y="48" width="14" height="14" rx="2" fill="#F59E0B" />

    <g className="crane-hook">
      <line x1="120" y1="60" x2="120" y2="100" stroke="#475569" strokeWidth="1" />
      <rect x="113" y="100" width="14" height="6" rx="1" fill="#F59E0B" />
      <path d="M117 106 L117 112 Q117 116 120 116 Q123 116 123 112 L123 106" stroke="#131B2E" strokeWidth="1.5" fill="none" />
    </g>
  </g>

  <g transform="translate(40,178)">
    <circle r="5" cx="0" cy="0" fill="#F59E0B" />
    <rect x="-3" y="0" width="6" height="12" fill="#475569" />
  </g>
  <g transform="translate(252,178)">
    <circle r="5" cx="0" cy="0" fill="#F59E0B" />
    <rect x="-3" y="0" width="6" height="12" fill="#475569" />
  </g>
</svg>
  );
}
