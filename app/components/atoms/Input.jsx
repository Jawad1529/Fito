export default function Input({ id, label, icon, error, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>}
        <input
          id={id}
          className={`w-full rounded-md bg-overlay border text-text placeholder:text-text-muted text-sm py-2.5 outline-none transition-colors ${
            error ? 'border-danger' : 'border-border-light focus:border-primary'
          } ${icon ? 'pl-10 pr-4' : 'px-4'}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
