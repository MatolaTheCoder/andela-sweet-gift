import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { HiOutlineX } from 'react-icons/hi';

const SIZES = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

/**
 * Janela modal acessível (foco preso, Esc fecha, clique fora fecha).
 * O conteúdo rola dentro do painel quando é mais alto do que o ecrã.
 */
export default function Modal({ open, title, description, size = 'lg', onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-black/50 transition duration-200 ease-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
        <DialogPanel
          transition
          className={`my-4 w-full ${SIZES[size] ?? SIZES.lg} rounded-xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 border border-neutral-200 bg-surface shadow-xl`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-neutral-900">{title}</DialogTitle>
              {description && (
                <Description className="mt-0.5 text-sm text-neutral-600">{description}</Description>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost -mr-2 px-2"
              aria-label="Fechar"
            >
              <HiOutlineX className="text-lg" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
