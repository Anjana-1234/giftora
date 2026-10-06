import '../styles/auth.css';

// A single continuous-line flower mark -- the one deliberate visual
// flourish on the auth pages. Everything else stays quiet.
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
      <path d="M24 112 C18 106 16 98 20 90" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M96 88 C102 82 104 74 100 66" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Shared shell for /login and /signup so both stay visually consistent.
// `tabs` is optional -- only the login page uses it (customer/admin switch).
function AuthLayout({ title, subtitle, tabs, children, footer }) {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <div className="auth-brand-inner">
          <BotanicalMark />
          <p className="auth-wordmark">Giftora</p>
          <p className="auth-tagline">Flowers and gifts for the moments that matter.</p>
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