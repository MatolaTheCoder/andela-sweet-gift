import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({ icon: Icon = HiOutlineInbox, title = 'Sem registos', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl text-neutral-500">
        <Icon />
      </span>
      <p className="text-sm font-semibold text-neutral-700">{title}</p>
      {message && <p className="max-w-sm text-sm text-neutral-600">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
