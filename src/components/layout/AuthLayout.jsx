import React from 'react';
import { HiOutlineGift } from 'react-icons/hi';

const highlights = [
  'Catálogo de produtos e stock',
  'Encomendas e entregas num só lugar',
  'Clientes agregados automaticamente',
  'Pagamentos e exportação de dados',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-dvh bg-neutral-100 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-purple-950 p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-800/70 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-purple-800/40 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-800 text-2xl">
            <HiOutlineGift />
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight">Andela</p>
            <p className="text-xs text-purple-300">Sweet Gift</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="text-3xl font-semibold leading-tight">
            Toda a gestão da tua loja num só painel.
          </p>
          <p className="mt-3 text-sm text-purple-200">
            Produtos, encomendas, clientes e pagamentos — simples e rápido.
          </p>
          <ul className="mt-6 space-y-2.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-purple-100">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-purple-300">
          © {year} Andela Sweet Gift
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-800 text-xl text-white">
              <HiOutlineGift />
            </span>
            <div>
              <p className="text-base font-semibold leading-tight text-neutral-900">Andela</p>
              <p className="text-xs text-neutral-500">Sweet Gift</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}

          <div className="card mt-6 p-5 sm:p-6">{children}</div>

          {footer && <div className="mt-4 text-center text-sm text-neutral-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
