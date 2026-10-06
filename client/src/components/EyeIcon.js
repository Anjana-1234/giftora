// Small line-style eye icon, used to toggle password visibility.
// Replaces the emoji icon so it matches the rest of the UI's typography.
function EyeIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <>
          <path
            d="M2 12C4.5 7 8 4.5 12 4.5S19.5 7 22 12c-2.5 5-6 7.5-10 7.5S4.5 17 2 12Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </>
      ) : (
        <>
          <path
            d="M9.9 5.1A10.6 10.6 0 0 1 12 4.5c4 0 7.5 2.5 10 7.5a15 15 0 0 1-3.2 4.2M6.5 6.6C4.6 8 3.1 10 2 12c2.5 5 6 7.5 10 7.5 1.3 0 2.5-.2 3.6-.7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.9 10a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default EyeIcon;