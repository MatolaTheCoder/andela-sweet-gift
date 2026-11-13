import React from 'react';

/** Miniatura do produto: a foto, ou a inicial do nome quando não há foto. */
export default function ProductThumb({ src, name = '', className = 'h-10 w-10' }) {
  if (src) {
    return <img src={src} alt="" className={`${className} shrink-0 rounded-lg object-cover`} />;
  }
  return (
    <span
      className={`${className} flex shrink-0 items-center justify-center rounded-lg bg-purple-50 text-sm font-semibold text-purple-700`}
      aria-hidden="true"
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}
