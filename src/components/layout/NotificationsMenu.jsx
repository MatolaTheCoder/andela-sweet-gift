import React from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { HiOutlineBell } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAlerts } from '../../lib/alerts';
import { useAuth } from '../../lib/auth';
import { useSettings } from '../../lib/settings';

const DOT = { danger: 'bg-rose-600', warning: 'bg-amber-600' };

/** Sino do cabeçalho: entregas de hoje, atrasos e stock, com marcação de lidas. */
export default function NotificationsMenu() {
  const { can } = useAuth();
  const { settings } = useSettings();
  const { alerts, read, unread, refresh, markRead, markAllRead } = useAlerts(can);
  const enabled = settings.notificacoes;
  const count = enabled ? unread.length : 0;

  return (
    <Popover className="relative">
      <PopoverButton
        className="btn btn-ghost relative px-2"
        aria-label={count ? `Notificações: ${count} por ler` : 'Notificações'}
        onClick={refresh}
      >
        <HiOutlineBell className="text-xl" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </PopoverButton>

      <PopoverPanel className="absolute right-0 top-full z-40 mt-2 w-96 max-w-[90vw] rounded-xl border border-neutral-200 bg-surface shadow-lg">
        {({ close }) => (
          <>
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <p className="text-base font-semibold text-neutral-900">Notificações</p>
              {enabled && count > 0 && (
                <button type="button" className="link-action" onClick={markAllRead}>
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {!enabled ? (
              <p className="p-4 text-sm text-neutral-600">Os alertas estão desativados nas Definições.</p>
            ) : alerts.length === 0 ? (
              <p className="p-4 text-sm text-neutral-600">Tudo em dia: sem entregas em atraso nem stock baixo.</p>
            ) : (
              <ul className="max-h-96 divide-y divide-neutral-100 overflow-y-auto">
                {alerts.map((alert) => {
                  const isRead = read.includes(alert.id);
                  return (
                    <li key={alert.id}>
                      <Link
                        to={alert.to}
                        onClick={() => {
                          markRead(alert.id);
                          close();
                        }}
                        className="flex gap-3 px-4 py-3 hover:bg-neutral-50"
                      >
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? 'bg-neutral-300' : DOT[alert.tone]}`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className={`block text-sm ${isRead ? 'text-neutral-700' : 'font-semibold text-neutral-900'}`}>
                            {alert.title}
                            <span className="sr-only">{isRead ? ' (lida)' : ' (por ler)'}</span>
                          </span>
                          <span className="block text-sm text-neutral-600">{alert.detail}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}
