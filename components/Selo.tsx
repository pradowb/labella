type SeloProps = {
  size?: number;
  compact?: boolean;
  className?: string;
  rimId: string;
};

export function Selo({ size = 220, compact = false, className, rimId }: SeloProps) {

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path
          id={`${rimId}-rim`}
          d="M120,120 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"
        />
      </defs>

      <circle cx="120" cy="120" r="118" fill="var(--ink)" stroke="var(--red)" strokeWidth="2.2" />
      <circle
        cx="120"
        cy="120"
        r="110"
        fill="none"
        stroke="var(--red)"
        strokeWidth="0.8"
        strokeDasharray="2.4 3.6"
        opacity="0.7"
      />
      <circle cx="120" cy="120" r="98" fill="none" stroke="var(--red)" strokeWidth="1.4" />
      <circle cx="120" cy="120" r="74" fill="var(--champagne-deep)" stroke="var(--red)" strokeWidth="1.1" />

      {!compact && (
        <text
          fill="var(--red)"
          fontFamily="'Courier Prime', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="3.2"
        >
          <textPath href={`#${rimId}-rim`} startOffset="0%">
            PIZZARIA BRASILEIRA · DUAS PÁTRIAS · UM FORNO ·
          </textPath>
        </text>
      )}

      <g transform="translate(120 118)" fill="none" stroke="var(--red)" strokeWidth="1.6">
        <ellipse cx="0" cy="10" rx="28" ry="10" opacity="0.85" />
        <path d="M-22 6 C-18 -18, 18 -18, 22 6" />
        <path d="M0 6 V-22" />
        <path d="M-8 -8 C-4 -16, 4 -16, 8 -8" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
