// components/atoms/Tag.jsx
const VARIANTS = {
  solid: 'bg-yellow-400 text-black',
  outline: 'border border-yellow-400/60 text-yellow-400 bg-transparent',
  muted: 'bg-white/10 text-white/70',
};

// variant: 'solid' | 'outline' | 'muted'
export default function Tag({ children, variant = 'muted', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        VARIANTS[variant] || VARIANTS.muted
      } ${className}`}
    >
      {children}
    </span>
  );
}