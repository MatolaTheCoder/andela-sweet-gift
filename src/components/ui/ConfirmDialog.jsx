import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react';

export default function ConfirmDialog({
  open,
  title = 'Confirmar ação',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-black/50 transition duration-200 ease-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-xl border border-neutral-200 bg-surface p-6 shadow-xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="text-lg font-semibold text-neutral-900">{title}</DialogTitle>
          {description && (
            <Description className="mt-2 text-sm text-neutral-600">{description}</Description>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`btn ${tone === 'danger' ? 'btn-danger' : 'btn-primary'}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'A processar...' : confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
