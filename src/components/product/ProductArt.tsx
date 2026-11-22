/**
 * Векторные иллюстрации продуктов. Нарисованы специально для проекта — без
 * случайных стоковых фото. Чтобы использовать фотографию, добавьте в данные
 * поле изображения и рендерьте <Image> из next/image вместо ProductArt.
 */
import { useId } from "react";

interface Props {
  art: string;
  className?: string;
  title?: string;
  animated?: boolean;
}

export function ProductArt({ art, className, title, animated = true }: Props) {
  const uid = useId().replace(/:/g, "");
  const g = (n: string) => `${uid}-${n}`;
  const common = { viewBox: "0 0 200 200", className, role: title ? "img" : undefined, "aria-label": title, "aria-hidden": title ? undefined : true } as const;

  switch (art) {
    case "soda":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={g("can")} x1="0" x2="1">
              <stop offset="0" stopColor="#b91c3c" />
              <stop offset=".45" stopColor="#ef4462" />
              <stop offset="1" stopColor="#9f1239" />
            </linearGradient>
            <linearGradient id={g("metal")} x1="0" x2="1">
              <stop offset="0" stopColor="#9ca3af" />
              <stop offset=".5" stopColor="#f3f4f6" />
              <stop offset="1" stopColor="#6b7280" />
            </linearGradient>
            <linearGradient id={g("glass")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c2d12" stopOpacity=".85" />
              <stop offset="1" stopColor="#3b0a0a" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="182" rx="70" ry="8" fill="currentColor" opacity=".08" />
          {/* стакан */}
          <path d="M120 92h52l-6 86a6 6 0 0 1-6 5h-28a6 6 0 0 1-6-5Z" fill="#ffffff" opacity=".35" stroke="#94a3b8" strokeOpacity=".5" />
          <path d="M124 110h44l-4.6 67a4 4 0 0 1-4 3.7h-26.8a4 4 0 0 1-4-3.7Z" fill={`url(#${g("glass")})`} />
          <rect x="132" y="96" width="14" height="14" rx="3" fill="#e0f2fe" opacity=".8" transform="rotate(-12 139 103)" />
          <rect x="150" y="100" width="12" height="12" rx="3" fill="#e0f2fe" opacity=".7" transform="rotate(10 156 106)" />
          {[132, 144, 156].map((x, i) => (
            <circle key={x} cx={x} cy={170} r={2.2} fill="#fff" opacity=".8" className={animated ? "art-bubble" : undefined} style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
          <path d="M152 70 158 112" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
          {/* банка */}
          <rect x="34" y="40" width="72" height="140" rx="14" fill={`url(#${g("can")})`} />
          <rect x="38" y="34" width="64" height="12" rx="6" fill={`url(#${g("metal")})`} />
          <rect x="38" y="172" width="64" height="10" rx="5" fill={`url(#${g("metal")})`} />
          <path d="M34 92c24-14 48 14 72 0v26c-24 14-48-14-72 0Z" fill="#fff" opacity=".92" />
          <text x="70" y="112" textAnchor="middle" fontSize="15" fontWeight="800" fill="#be123c" fontFamily="system-ui">FIZZ</text>
          <rect x="44" y="52" width="7" height="110" rx="3.5" fill="#fff" opacity=".25" />
          <ellipse cx="70" cy="37" rx="10" ry="3" fill="#6b7280" opacity=".6" />
        </svg>
      );
    case "chips":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={g("bag")} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#facc15" />
              <stop offset=".6" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>
            <radialGradient id={g("chip")} cx=".4" cy=".35" r=".8">
              <stop offset="0" stopColor="#fde68a" />
              <stop offset=".7" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#d97706" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="182" rx="72" ry="8" fill="currentColor" opacity=".08" />
          <path d="M40 30h96l-4 8 6 6-4 120 4 8-4 8H42l-4-8 4-8-4-120 6-6Z" fill={`url(#${g("bag")})`} />
          <path d="M42 36h92M42 172h92" stroke="#92400e" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 4" />
          <rect x="50" y="56" width="76" height="40" rx="12" fill="#b45309" opacity=".9" />
          <text x="88" y="82" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fef3c7" fontFamily="system-ui">CRISP</text>
          <ellipse cx="88" cy="128" rx="28" ry="20" fill={`url(#${g("chip")})`} />
          <path d="M74 124c6 3 14 3 20-1m-16 10c5 2 12 2 18-1" stroke="#b45309" strokeOpacity=".45" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="52" y="44" width="6" height="118" rx="3" fill="#fff" opacity=".25" />
          {/* отдельные чипсы */}
          <g className={animated ? "animate-float" : undefined} style={{ ["--r" as string]: "-14deg" }}>
            <path d="M150 112c14-6 30 2 30 14s-18 18-32 12-12-20 2-26Z" fill={`url(#${g("chip")})`} transform="rotate(-14 160 125)" />
          </g>
          <g className={animated ? "animate-float" : undefined} style={{ animationDelay: "1.2s", ["--r" as string]: "18deg" }}>
            <path d="M146 152c10-6 26-2 28 8s-12 16-24 13-14-15-4-21Z" fill={`url(#${g("chip")})`} transform="rotate(18 158 162)" />
          </g>
          <circle cx="168" cy="104" r="2" fill="#fff" />
          <circle cx="160" cy="148" r="1.6" fill="#fff" />
        </svg>
      );
    case "coffee":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={g("cup")} x1="0" x2="1">
              <stop offset="0" stopColor="#f8fafc" />
              <stop offset=".6" stopColor="#ffffff" />
              <stop offset="1" stopColor="#cbd5e1" />
            </linearGradient>
            <radialGradient id={g("brew")} cx=".5" cy=".4" r=".7">
              <stop offset="0" stopColor="#92400e" />
              <stop offset=".6" stopColor="#5b2a0e" />
              <stop offset="1" stopColor="#3a1a08" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="176" rx="78" ry="10" fill="currentColor" opacity=".08" />
          <ellipse cx="96" cy="160" rx="72" ry="16" fill="#e2e8f0" />
          <ellipse cx="96" cy="156" rx="60" ry="11" fill="#f8fafc" />
          {[70, 96, 122].map((x, i) => (
            <path key={x} d={`M${x} 70c-8-10 8-16 0-28`} stroke="currentColor" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" fill="none" className={animated ? "art-steam" : undefined} style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
          <path d="M150 104h8a20 20 0 0 1 0 40h-12" stroke="#cbd5e1" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M40 88h112l-8 52a30 30 0 0 1-30 24H78a30 30 0 0 1-30-24Z" fill={`url(#${g("cup")})`} />
          <ellipse cx="96" cy="88" rx="56" ry="12" fill="#e2e8f0" />
          <ellipse cx="96" cy="89" rx="50" ry="9" fill={`url(#${g("brew")})`} />
          <ellipse cx="84" cy="87" rx="12" ry="2.6" fill="#d6a46b" opacity=".55" />
          <path d="M56 100c2 18 8 34 16 46" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8" />
          <path d="M150 34c6 0 10 4 10 10s-10 10-10 10-10-4-10-10 4-10 10-10Z" fill="#7c2d12" transform="rotate(30 150 44)" />
          <path d="M146 38c3 4 5 8 8 12" stroke="#d6a46b" strokeWidth="2" transform="rotate(30 150 44)" />
        </svg>
      );
    case "burger":
      return (
        <svg {...common}>
          <ellipse cx="100" cy="170" rx="70" ry="8" fill="currentColor" opacity=".08" />
          <path d="M36 98a64 50 0 0 1 128 0Z" fill="#f59e0b" />
          <path d="M36 98a64 50 0 0 1 128 0" fill="none" stroke="#d97706" strokeWidth="3" />
          {[70, 92, 112, 132, 82, 122].map((x, i) => <ellipse key={i} cx={x} cy={i < 4 ? 70 : 82} rx="4" ry="2" fill="#fef3c7" />)}
          <path d="M30 104c10 10 20 0 30 8s20-4 30 4 20-6 30 2 20-6 30 2 12-4 20-2v-14H30Z" fill="#22c55e" />
          <rect x="34" y="112" width="132" height="10" rx="4" fill="#ef4444" />
          <rect x="30" y="122" width="140" height="20" rx="10" fill="#7c2d12" />
          <path d="M38 142h124v6a16 16 0 0 1-16 16H54a16 16 0 0 1-16-16Z" fill="#f59e0b" />
        </svg>
      );
    case "chocolate":
      return (
        <svg {...common}>
          <ellipse cx="100" cy="176" rx="60" ry="8" fill="currentColor" opacity=".08" />
          <g transform="rotate(-10 100 100)">
            <rect x="50" y="30" width="100" height="140" rx="10" fill="#5b2a0e" />
            {[0, 1, 2].map((r) => [0, 1].map((c) => (
              <rect key={`${r}-${c}`} x={58 + c * 44} y={38 + r * 30} width="38" height="24" rx="5" fill="#7c3a12" stroke="#3a1a08" strokeOpacity=".4" />
            )))}
            <path d="M50 124h100v36a10 10 0 0 1-10 10H60a10 10 0 0 1-10-10Z" fill="#1d4ed8" />
            <path d="M50 124l20 10 18-8 22 10 20-8 20 8" stroke="#93c5fd" strokeWidth="2" fill="none" />
          </g>
        </svg>
      );
    case "energy":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={g("ecan")} x1="0" x2="1">
              <stop offset="0" stopColor="#1e3a8a" />
              <stop offset=".45" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id={g("emetal")} x1="0" x2="1">
              <stop offset="0" stopColor="#9ca3af" />
              <stop offset=".5" stopColor="#f3f4f6" />
              <stop offset="1" stopColor="#6b7280" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="184" rx="52" ry="8" fill="currentColor" opacity=".08" />
          <rect x="70" y="26" width="60" height="156" rx="12" fill={`url(#${g("ecan")})`} />
          <rect x="74" y="20" width="52" height="12" rx="6" fill={`url(#${g("emetal")})`} />
          <rect x="74" y="174" width="52" height="10" rx="5" fill={`url(#${g("emetal")})`} />
          <path d="M106 58 84 108h16l-8 42 26-56h-17l10-36Z" fill="#a3e635" stroke="#365314" strokeOpacity=".4" strokeWidth="2" strokeLinejoin="round" />
          <text x="100" y="166" textAnchor="middle" fontSize="12" fontWeight="800" fill="#e0f2fe" fontFamily="system-ui" letterSpacing="1">VOLT</text>
          <rect x="78" y="36" width="6" height="130" rx="3" fill="#fff" opacity=".22" />
          <ellipse cx="100" cy="23" rx="9" ry="2.6" fill="#6b7280" opacity=".6" />
          {[150, 160, 44].map((x, i) => (
            <path key={x} d={`M${x} ${60 + i * 34}l6-10m4 14 10-4`} stroke="#a3e635" strokeWidth="3" strokeLinecap="round" className={animated ? "animate-float" : undefined} style={{ animationDelay: `${i * 0.7}s` }} />
          ))}
        </svg>
      );
    case "noodles":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={g("ncup")} x1="0" x2="1">
              <stop offset="0" stopColor="#fef3c7" />
              <stop offset=".55" stopColor="#ffffff" />
              <stop offset="1" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="182" rx="62" ry="8" fill="currentColor" opacity=".08" />
          {[78, 100, 122].map((x, i) => (
            <path key={x} d={`M${x} 52c-8-10 8-16 0-28`} stroke="currentColor" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" fill="none" className={animated ? "art-steam" : undefined} style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
          <path d="M150 30 112 96M164 36 120 100" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          <path d="M44 76h112l-12 98a10 10 0 0 1-10 8H66a10 10 0 0 1-10-8Z" fill={`url(#${g("ncup")})`} />
          <rect x="52" y="108" width="96" height="34" rx="6" fill="#dc2626" />
          <text x="100" y="131" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="system-ui">NOODLE</text>
          <ellipse cx="100" cy="76" rx="56" ry="11" fill="#f59e0b" />
          <path d="M58 76c8-8 14 8 22 0s14 8 22 0 14 8 22 0 12 6 18 2M62 80c8-6 14 6 22 0s14 6 22 0 14 6 22 0" stroke="#fde68a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="82" cy="72" r="5" fill="#16a34a" />
          <circle cx="118" cy="74" r="4" fill="#ef4444" />
          <rect x="60" y="88" width="5" height="80" rx="2.5" fill="#fff" opacity=".6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="100" cy="100" r="64" fill="currentColor" opacity=".08" />
          <path d="M70 110a30 30 0 0 0 60 0Z" fill="currentColor" opacity=".25" />
        </svg>
      );
  }
}
