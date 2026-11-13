import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Acções de uma linha de tabela: texto sublinhado, separado por um divisor
 * quando há mais do que uma.
 *
 * @param {{label: string, ariaLabel?: string, to?: string, onClick?: () => void, danger?: boolean}[]} actions
 */
export default function RowActions({ actions = [] }) {
  const items = actions.filter(Boolean);

  return (
    <div className="flex items-center justify-end">
      {items.map((action, index) => {
        const className = `link-action ${action.danger ? 'link-action-danger' : ''}`;
        return (
          <React.Fragment key={action.label}>
            {index > 0 && <span className="mx-3 h-4 w-px bg-neutral-300" aria-hidden="true" />}
            {action.to ? (
              <Link to={action.to} className={className} aria-label={action.ariaLabel}>
                {action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className={className}
                aria-label={action.ariaLabel}
              >
                {action.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
