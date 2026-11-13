import React from 'react';
import {
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineMoon,
  HiOutlineSearch,
  HiOutlineSun,
  HiOutlineUser,
} from 'react-icons/hi';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { initials } from '../../lib/format';
import { roleLabel } from '../../lib/permissions';
import { useTheme } from '../../lib/theme';
import GlobalSearch from './GlobalSearch';
import MessagesMenu from './MessagesMenu';
import NotificationsMenu from './NotificationsMenu';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { resolved, toggle } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutRequest();
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const userName = user?.name || 'Utilizador';
  const userRole = user?.role ? roleLabel(user.role) : user?.email || 'Sessão iniciada';

  return (
    <header className="no-print flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 bg-surface px-3 sm:gap-4 sm:px-6">
      <button type="button" className="btn btn-ghost px-2 lg:hidden" onClick={onMenuClick} aria-label="Abrir menu">
        <HiOutlineMenuAlt2 className="text-xl" />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="btn btn-ghost px-2 sm:hidden"
          onClick={() => navigate('/produtos/list')}
          aria-label="Pesquisar produtos"
        >
          <HiOutlineSearch className="text-xl" />
        </button>

        <button
          type="button"
          className="btn btn-ghost px-2"
          onClick={toggle}
          aria-label={resolved === 'dark' ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'}
          title={resolved === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {resolved === 'dark' ? <HiOutlineSun className="text-xl" /> : <HiOutlineMoon className="text-xl" />}
        </button>

        <MessagesMenu />
        <NotificationsMenu />

        <Menu as="div" className="relative ml-1">
          <MenuButton
            className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-800 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label={`${initials(userName)} – menu do utilizador (${userName})`}
          >
            {initials(userName)}
          </MenuButton>
          <MenuItems className="absolute right-0 top-full z-40 mt-2 w-56 origin-top-right rounded-xl border border-neutral-200 bg-surface p-1.5 shadow-lg focus:outline-none">
            <div className="border-b border-neutral-100 px-3 py-2">
              <p className="truncate text-base font-semibold text-neutral-900">{userName}</p>
              <p className="truncate text-xs text-neutral-600">{userRole}</p>
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
