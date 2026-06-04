import Link from "next/link";

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-[10px] ${className}`}>
      <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="12" fill="#0F4395" />
        <rect x="11" y="30" width="9" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.85" />
        <rect x="23" y="20" width="9" height="28" rx="2" fill="#FFFFFF" />
        <rect x="35" y="10" width="9" height="38" rx="2" fill="#F59E0B" />
      </svg>
      <span className="font-extrabold text-[18px] tracking-[-0.02em]">BuildData</span>
    </Link>
  );
}
