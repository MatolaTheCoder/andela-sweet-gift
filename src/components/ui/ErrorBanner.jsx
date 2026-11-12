import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <HiOutlineExclamationCircle className="mt-0.5 shrink-0 text-lg" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button type="button" className="font-semibold underline" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
