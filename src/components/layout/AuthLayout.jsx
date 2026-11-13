import React from 'react';
import { HiOutlineGift } from 'react-icons/hi';
import { useSettings } from '../../lib/settings';

/**
 * Moldura das páginas de entrada: um cartão centrado sobre um fundo claro com
 * formas suaves em movimento lento. As animações (ver index.css) desligam-se
 * sozinhas para quem pede "reduzir movimento".
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  const year = new Date().getFullYear();
  const { settings } = useSettings();
  const [first, ...rest] = settings.empresa.split(' ');

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 dark:bg-neutral-100">
      <div
        className="float-slow pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="float-slow pointer-events-none absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ animationDelay: '-4s' }}
        aria-hidden="true"
      />
      <div
        className="float-slow pointer-events-none absolute right-1/4 top-1/3 h-48 w-48 rounded-full blur-2xl"
        style={{ animationDelay: '-7s' }}
        aria-hidden="true"
      />

      <main className="auth-card-in relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center text-neutral-900">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-800 text-3xl text-white shadow-lg shadow-purple-900/30">
            <HiOutlineGift aria-hidden="true" />
          </span>
          <p className="mt-3 text-xl font-semibold leading-tight">{first}</p>
          {rest.length > 0 && <p className="text-sm text-neutral-600">{rest.join(' ')}</p>}
        </div>

        <div className="rounded-2xl bg-surface p-6 shadow-2xl shadow-purple-900/15 ring-1 ring-black/5 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-neutral-700">{footer}</div>}
        <p className="mt-6 text-center text-xs text-neutral-600">
          © {year} {settings.empresa}
        </p>
      </main>
    </div>
  );
}
