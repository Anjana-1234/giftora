import { useState, useEffect } from 'react';
import '../styles/auth.css';

// Short lines that rotate in the brand panel. Each one points at
// something the shop really does (bouquets, gifts, delivery slots).
const MESSAGES = [
  'Fresh bouquets, hand-tied and delivered to their door.',
  'Gifts for every occasion, wrapped with care.',
  'Pick the day and time slot that suits you.',
];

// A handful of petals that drift down the panel. Negative delays mean
// they are already mid-fall when the page loads.
const PETALS = [
  { left: '6%',  size: 14, delay: '-2s',  dur: '17s', sway: '30px' },
  { left: '18%', size: 10, delay: '-9s',  dur: '14s', sway: '-24px' },
  { left: '30%', size: 16, delay: '-5s',  dur: '19s', sway: '26px' },
  { left: '44%', size: 11, delay: '-12s', dur: '15s', sway: '-30px' },
  { left: '56%', size: 15, delay: '-7s',  dur: '18s', sway: '22px' },
  { left: '68%', size: 10, delay: '-1s',  dur: '13s', sway: '-20px' },
  { left: '78%', size: 13, delay: '-10s', dur: '16s', sway: '28px' },
  { left: '88%', size: 17, delay: '-4s',  dur: '20s', sway: '-26px' },
  { left: '94%', size: 9,  delay: '-14s', dur: '15s', sway: '18px' },
];

// Small flower mark -- only shown on mobile, where the big illustration is hidden.
function BotanicalMark() {
  return (
    <svg className="auth-mark" viewBox="0 0 120 170" fill="none" aria-hidden="true">
      <path d="M60 170 C58 130 62 95 60 60" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M60 150 C40 145 28 130 24 112" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M60 128 C80 122 92 106 96 88" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M60 60 C48 52 44 38 50 24 C56 34 60 40 60 60 C60 40 64 34 70 24 C76 38 72 52 60 60Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="60" r="3.5" fill="currentColor" />
    </svg>
  );
}

// One five-petal flower head, drawn around (cx, cy).
function FlowerHead({ cx, cy, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-12"
          rx="7"
          ry="12"
          transform={`rotate(${angle})`}
          fill="rgba(214,57,110,0.22)"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      ))}
      <circle cx="0" cy="0" r="4" fill="currentColor" />
    </g>
  );
}

// Gift box with a bow, and two flowers growing beside it.
function GiftAndFlowers() {
  return (
    <svg className="auth-illustration" viewBox="0 0 220 240" fill="none" aria-hidden="true">
      {/* ground line */}
      <path d="M16 222 H204" stroke="currentColor" strokeWidth="1" opacity="0.35" strokeLinecap="round" />

      {/* left flower (smaller) */}
      <g className="auth-sway auth-sway-b">
        <path d="M34 222 C36 198 32 180 34 162" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M34 196 C24 192 20 184 20 176 C28 178 33 186 34 196Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <FlowerHead cx={34} cy={150} scale={0.8} />
      </g>

      {/* right flower (taller) */}
      <g className="auth-sway">
        <path d="M184 222 C182 180 188 150 185 104" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M184 184 C196 180 202 170 202 160 C192 162 185 172 184 184Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <FlowerHead cx={185} cy={92} scale={1} />
      </g>

      {/* gift box */}
      <rect x="62" y="152" width="96" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
      <rect x="54" y="132" width="112" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
      <path d="M104 132 V222 M116 132 V222" stroke="currentColor" strokeWidth="1.2" />

      {/* bow */}
      <g className="auth-bow">
        <path d="M110 132 C90 100 68 112 82 129 C89 136 104 134 110 132Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(214,57,110,0.22)" />
        <path d="M110 132 C130 100 152 112 138 129 C131 136 116 134 110 132Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(214,57,110,0.22)" />
        <circle cx="110" cy="132" r="3.5" fill="currentColor" />
      </g>
    </svg>
  );
}

// Shared shell for /login and /signup so both stay visually consistent.
// `tabs` is optional -- only the login page uses it (customer/admin switch).
function AuthLayout({ title, subtitle, tabs, children, footer }) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate the brand-panel message every few seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="auth-page">
      <aside className="auth-brand">

        {/* soft moving glows + falling petals (decorative only) */}
        <div className="auth-glow auth-glow-a" aria-hidden="true" />
        <div className="auth-glow auth-glow-b" aria-hidden="true" />
        <div className="auth-petals" aria-hidden="true">
          {PETALS.map((p, i) => (
            <span
              key={i}
              className="auth-petal"
              style={{
                left: p.left,
                '--size': `${p.size}px`,
                '--delay': p.delay,
                '--dur': p.dur,
                '--sway': p.sway,
              }}
            />
          ))}
        </div>

        <div className="auth-brand-inner">
          <BotanicalMark />
          <GiftAndFlowers />

          <p className="auth-wordmark">Giftora</p>

          <div className="auth-rotator" aria-live="polite">
            {MESSAGES.map((text, i) => (
              <p
                key={text}
                className={`auth-message ${i === messageIndex ? 'active' : ''}`}
              >
                {text}
              </p>
            ))}
          </div>

          <div className="auth-dots">
            {MESSAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`auth-dot ${i === messageIndex ? 'active' : ''}`}
                onClick={() => setMessageIndex(i)}
                aria-label={`Show message ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-inner">
          {tabs}
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          {footer && <p className="auth-footer">{footer}</p>}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;