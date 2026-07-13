// components/atoms/Divider.jsx
// orientation: 'horizontal' | 'vertical'; pass `label` for a "or"-style split
export default function Divider({ label, orientation = 'horizontal', className = '' }) {
  if (orientation === 'vertical') {
    return <span className={`inline-block w-px self-stretch bg-white/10 ${className}`} />;
  }

  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-white/40">{label}</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    );
  }

  return <hr className={`border-t border-white/10 ${className}`} />;
}