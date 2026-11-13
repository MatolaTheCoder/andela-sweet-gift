import React, { useEffect, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { getMessages, markMessagesRead } from '../../lib/api';

const relative = new Intl.RelativeTimeFormat('pt-PT', { numeric: 'auto' });

const ago = (iso) => {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  if (Math.abs(minutes) < 60) return relative.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relative.format(hours, 'hour');
  return relative.format(Math.round(hours / 24), 'day');
};

/** Mensagens de clientes (simuladas): ver, abrir e marcar como lidas. */
export default function MessagesMenu() {
  const [messages, setMessages] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    getMessages().then(setMessages).catch(() => {});
  }, []);

  const unread = messages.filter((message) => message.unread).length;

  const toggle = async (message) => {
    setOpenId((current) => (current === message.id ? null : message.id));
    if (message.unread) setMessages(await markMessagesRead([message.id]));
  };

  return (
    <Popover className="relative">
      <PopoverButton
        className="btn btn-ghost relative px-2"
        aria-label={unread ? `Mensagens: ${unread} por ler` : 'Mensagens'}
      >
        <HiOutlineChatAlt2 className="text-xl" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-800 px-1 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </PopoverButton>

      <PopoverPanel className="absolute right-0 top-full z-40 mt-2 w-96 max-w-[90vw] rounded-xl border border-neutral-200 bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <p className="text-base font-semibold text-neutral-900">Mensagens</p>
          {unread > 0 && (
            <button type="button" className="link-action" onClick={async () => setMessages(await markMessagesRead('all'))}>
              Marcar todas como lidas
            </button>
          )}
        </div>
        {messages.length === 0 ? (
          <p className="p-4 text-sm text-neutral-600">Nenhuma mensagem.</p>
        ) : (
          <ul className="max-h-96 divide-y divide-neutral-100 overflow-y-auto">
            {messages.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => toggle(message)}
                  aria-expanded={openId === message.id}
                  className="flex w-full gap-3 px-4 py-3 text-left hover:bg-neutral-50"
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${message.unread ? 'bg-purple-800' : 'bg-neutral-300'}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={`truncate text-sm ${message.unread ? 'font-semibold text-neutral-900' : 'text-neutral-800'}`}>
                        {message.from}
                        <span className="sr-only">{message.unread ? ' (por ler)' : ' (lida)'}</span>
                      </span>
                      <span className="shrink-0 text-xs text-neutral-600">{ago(message.date)}</span>
                    </span>
                    <span className={`block text-sm text-neutral-700 ${openId === message.id ? '' : 'line-clamp-2'}`}>
                      {message.text}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverPanel>
    </Popover>
  );
}
