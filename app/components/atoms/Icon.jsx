// components/atoms/Icon.jsx
// One shared icon component. Add a glyph once here, use it everywhere as
// <Icon name="search" /> instead of pulling in an icon package per-component.

const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9z" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 12.2a2 2 0 002 1.8h7.2a2 2 0 002-1.6L20 8H6" />
      <circle cx="9.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  login: (
    <>
      <path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M14 16l4-4-4-4" />
      <path d="M18 12H9" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
  star: (
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </>
  ),
  facebook: <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" fill="currentColor" stroke="none" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  twitter: (
    <path
      d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.7 11.7 0 013 4.9a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 01-1.9.1c.5 1.6 2 2.8 3.8 2.9A8.3 8.3 0 012 18.6a11.6 11.6 0 006.3 1.9c7.5 0 11.7-6.4 11.7-11.9v-.5c.8-.6 1.5-1.3 2-2.2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  scoop: (
    <>
      <path d="M4 10a8 8 0 0116 0v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1z" />
      <path d="M9 21l1-5M15 21l-1-5" />
    </>
  ),
  bar: (
    <>
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <path d="M4 8L2 7M4 16l-2 1M20 8l2-1M20 16l2 1" />
    </>
  ),
  shaker: (
    <>
      <path d="M9 3h6l1 3-1 2v11a2 2 0 01-2 2h-2a2 2 0 01-2-2V8L8 6l1-3z" />
      <path d="M8 11h8" />
    </>
  ),
  bolt: (
    <path
      d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"
      fill="currentColor"
      stroke="none"
    />
  ),
  dumbbell: (
    <>
      <rect x="2" y="9" width="2" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="20" y="9" width="2" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="5" y="7" width="3" height="10" rx="1" />
      <rect x="16" y="7" width="3" height="10" rx="1" />
      <path d="M8 12h8" />
    </>
  ),
};

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8 }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}