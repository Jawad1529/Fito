// components/atoms/Input.jsx
export default function Input({ label, error, icon, className = '', id, ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</span>}
        <input
          id={id}
          className={`w-full rounded-md bg-white/5 border text-white placeholder:text-white/30 text-sm py-2.5 outline-none transition-colors ${
            error ? 'border-red-500' : 'border-white/10 focus:border-yellow-400'
          } ${icon ? 'pl-10 pr-3' : 'px-3'} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}