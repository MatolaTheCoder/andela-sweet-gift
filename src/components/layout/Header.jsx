import React, { useEffect, useState } from 'react';
import {
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineSearch,
  HiOutlineUser,
} from 'react-icons/hi';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutRequest } from '../../lib/api';
import { initials } from '../../lib/format';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/produtos/list?q=${encodeURIComponent(term)}` : '/produtos/list');
  };

  const handleLogout = async () => {
    await logoutRequest();
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const userName = user?.name || 'Utilizador';
  const userEmail = user?.email || 'Sessão iniciada';

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-3 sm:gap-4 sm:px-6">
      <button
        type="button"
        className="btn btn-ghost px-2 lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <HiOutlineMenuAlt2 className="text-xl" />
      </button>

      <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 sm:block">
        <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="Pesquisar produtos..."
          aria-label="Pesquisar produtos"
          className="input h-9 pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="btn btn-ghost px-2 sm:hidden"
          onClick={() => navigate('/produtos/list')}
          aria-label="Pesquisar produtos"
        >
          <HiOutlineSearch className="text-xl" />
        </button>

        <Popover className="relative">
          <PopoverButton
            className="btn btn-ghost px-2"
            aria-label="Mensagens"
          >
            <HiOutlineChatAlt2 className="text-xl" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
            <p className="text-sm font-semibold text-neutral-800">Mensagens</p>
            <p className="mt-2 text-sm text-neutral-500">Nenhuma mensagem.</p>
          </PopoverPanel>
        </Popover>

        <Popover className="relative">
          <PopoverButton className="btn btn-ghost px-2" aria-label="Notificações">
            <HiOutlineBell className="text-xl" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
            <p className="text-sm font-semibold text-neutral-800">Notificações</p>
            <p className="mt-2 text-sm text-neutral-500">Sem notificações disponíveis.</p>
          </PopoverPanel>
        </Popover>

        <Menu as="div" className="relative ml-1">
          <MenuButton
            className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-800 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Menu do utilizador"
          >
            {initials(userName)}
          </MenuButton>
          <MenuItems className="absolute right-0 top-full z-40 mt-2 w-56 origin-top-right rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg focus:outline-none">
            <div className="border-b border-neutral-100 px-3 py-2">
              <p className="truncate text-sm font-semibold text-neutral-800">{userName}</p>
              <p className="truncate text-xs text-neutral-500">{userEmail}</p>
            </div>
            <MenuItem>
              <button
                type="button"
                onClick={() => navigate('/perfil')}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 data-[focus]:bg-neutral-100"
              >
                <HiOutlineUser /> Perfil
              </button>
            </MenuItem>
            <MenuItem>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 data-[focus]:bg-rose-50"
              >
                <HiOutlineLogout /> Terminar sessão
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
