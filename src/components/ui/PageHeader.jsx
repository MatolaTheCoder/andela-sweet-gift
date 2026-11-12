import React from 'react';

export default function PageHeader({ title, description, breadcrumb, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {breadcrumb && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            {breadcrumb}
          </p>
        )}
        <h1 className="truncate text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
