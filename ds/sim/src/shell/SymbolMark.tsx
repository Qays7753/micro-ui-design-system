/**
 * SymbolMark — the approved symbol (favicon.svg geometry, unchanged) drawn
 * inline at any size; the splash, the role screen and any surface reuse it.
 */
import { MODULE_PATH, SYMBOL_MODULES } from '../symbol';

export function SymbolMark({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 224 224"
      width={size}
      height={size}
      role="img"
      aria-label="Micro"
    >
      <g transform="translate(16 16)">
        {SYMBOL_MODULES.map((m) => (
          <g key={m.angle} transform={`rotate(${m.angle} 96 96)`}>
            <path d={MODULE_PATH} fill={m.fill} />
          </g>
        ))}
      </g>
    </svg>
  );
}
