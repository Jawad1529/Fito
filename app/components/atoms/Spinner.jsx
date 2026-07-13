// components/atoms/Spinner.jsx
export default function Spinner({
  className = 'w-5 h-5',
  trackClassName = 'text-white/20',
  spinClassName = 'text-yellow-400',
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className={trackClassName} />
      <path
        d="M22 12a10 10 0 00-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={spinClassName}
      />
    </svg>
  );
}