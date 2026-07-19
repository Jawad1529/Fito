'use client';

import { useEffect, useRef, useState } from 'react';

// Purely client-side selection (matches the old beforeUpload={() => false}
// antd usage — nothing here ever hits a server). value/onChange carry plain
// File[] instead of antd's {fileList} wrapper.
export default function Upload({
  value = [],
  onChange,
  multiple = false,
  accept,
  picture = false,
  triggerClassName = '',
  children,
  className = '',
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = value.map((file) =>
      file.type?.startsWith('image/') ? URL.createObjectURL(file) : null
    );
    setPreviews(urls);
    return () => urls.forEach((url) => url && URL.revokeObjectURL(url));
  }, [value]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    onChange?.(multiple ? [...value, ...selected] : selected);
    e.target.value = '';
  };

  const removeAt = (index) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const defaultTriggerClasses = picture
    ? 'w-24 h-24 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-light text-text-secondary hover:border-primary hover:text-text transition-colors text-xs'
    : 'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border-light text-text-secondary hover:border-primary hover:text-text transition-colors';

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleSelect}
        className="hidden"
      />

      <div className={picture ? 'flex flex-wrap gap-3' : 'flex flex-col gap-3'}>

        {picture &&
          value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-border-light bg-overlay"
            >
              {previews[index] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews[index]} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-text-muted p-1 text-center">
                  {file.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-scrim text-text-inverse text-xs flex items-center justify-center leading-none"
              >
                &times;
              </button>
            </div>
          ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={triggerClassName || defaultTriggerClasses}
        >
          {children}
        </button>

        {!picture && value.length > 0 && (
          <ul className="space-y-1.5">
            {value.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 bg-overlay rounded-md px-3 py-2 text-sm text-text-secondary"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="text-text-muted hover:text-danger shrink-0"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}
