import { useEffect, useRef } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';

const VARIANTS = {
  success: {
    icon: HiOutlineCheckCircle,
    iconClass: 'text-green-500',
    buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  error: {
    icon: HiOutlineXCircle,
    iconClass: 'text-red-500',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    icon: HiOutlineExclamationCircle,
    iconClass: 'text-amber-500',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
  },
  info: {
    icon: HiOutlineInformationCircle,
    iconClass: 'text-blue-500',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
};

/**
 * Alerta/modal reutilizável da aplicação.
 *
 * @param {boolean} open - Controla a visibilidade.
 * @param {'success'|'error'|'warning'|'info'} type - Variante visual.
 * @param {string} title - Título do alerta.
 * @param {string} message - Texto do alerta.
 * @param {string} confirmLabel - Texto do botão de confirmação.
 * @param {() => void} onClose - Chamado ao fechar (botão, ESC ou backdrop).
 * @param {number} autoClose - Milissegundos para fechar automaticamente (0 desativa).
 */
export default function Alert({
  open,
  type = 'info',
  title,
  message,
  confirmLabel = 'OK',
  onClose,
  autoClose = 0,
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    buttonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !autoClose) return;

    const timer = setTimeout(() => onClose?.(), autoClose);
    return () => clearTimeout(timer);
  }, [open, autoClose, onClose]);

  if (!open) return null;

  const variant = VARIANTS[type] ?? VARIANTS.info;
  const Icon = variant.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'alert-title' : undefined}
        aria-describedby={message ? 'alert-message' : undefined}
        className="toast-item relative w-full max-w-sm rounded-lg border border-neutral-200 bg-surface p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 shrink-0 text-2xl ${variant.iconClass}`} />
          <div className="min-w-0">
            {title && (
              <h2 id="alert-title" className="text-lg font-bold text-neutral-900">
                {title}
              </h2>
            )}
            {message && (
              <p id="alert-message" className="mt-1 text-sm text-neutral-600">
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            ref={buttonRef}
            type="button"
            onClick={onClose}
            className={`rounded px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${variant.buttonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
