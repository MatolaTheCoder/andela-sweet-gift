import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';

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
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-neutral-900">{title}</DialogTitle>
          {description && (
            <Description className="mt-2 text-sm text-neutral-500">{description}</Description>
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
