import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineGift, HiOutlineLogout } from 'react-icons/hi';
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../lib/constants';
import { logoutRequest } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useSettings } from '../../lib/settings';

const isActivePath = (pathname, path) =>
  path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);

export default function Sidebar({ open = false, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const { can } = useAuth();
  const { settings } = useSettings();
  const [brand, ...brandRest] = settings.empresa.split(' ');

  // Só mostra o que a conta pode usar.
  const allowed = (item) => !item.permission || can(item.permission);
  const links = DASHBOARD_SIDEBAR_LINKS.filter(allowed).map((item) =>
    item.children ? { ...item, children: item.children.filter(allowed) } : item
  );
  const bottomLinks = DASHBOARD_SIDEBAR_BOTTOM_LINKS.filter(allowed);

  React.useEffect(() => {
    const activeIndex = links.findIndex((item) =>
      item.children?.some((child) => isActivePath(pathname, child.path))
    );
    if (activeIndex >= 0) setOpenDropdown(activeIndex);
  }, [pathname]);

  const handleLogout = async () => {
    await logoutRequest();
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Barra lateral"
        className={`no-print fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-purple-950 text-slate-100 shadow-xl transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-800 text-2xl text-white">
            <HiOutlineGift />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight">{brand}</p>
            <p className="truncate text-xs text-purple-300">{brandRest.join(' ')}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-purple-400">
            Gestão
          </p>
          <div className="flex flex-col gap-0.5">
            {links.map((item, index) => {
              const active = isActivePath(pathname, item.path);

              return (
                <div key={item.key}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        aria-expanded={openDropdown === index}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base transition-colors ${
                          active || openDropdown === index
                            ? 'bg-purple-800 text-white'
                            : 'text-slate-200 hover:bg-purple-900 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-lg text-purple-300">{item.icon}</span>
                          {item.label}
                        </span>
                        <span
                          className={`text-xs transition-transform ${
                            openDropdown === index ? 'rotate-90' : ''
                          }`}
                        >
                          ›
                        </span>
                      </button>

                      {openDropdown === index && (
                        <div className="ml-8 mt-1 flex flex-col gap-0.5 border-l border-purple-800 pl-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.key}
                              to={child.path}
                              onClick={onClose}
                              className={`rounded-md px-3 py-1.5 text-base transition-colors ${
                                isActivePath(pathname, child.path)
                                  ? 'bg-purple-800 font-medium text-white'
                                  : 'text-slate-300 hover:bg-purple-900 hover:text-white'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-base transition-colors ${
                        active
                          ? 'bg-purple-800 font-medium text-white'
                          : 'text-slate-200 hover:bg-purple-900 hover:text-white'
                      }`}
                    >
                      <span className="text-lg text-purple-300">{item.icon}</span>
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-purple-900 px-3 py-3">
          {bottomLinks.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-base transition-colors ${
                isActivePath(pathname, item.path)
                  ? 'bg-purple-800 font-medium text-white'
                  : 'text-slate-200 hover:bg-purple-900 hover:text-white'
              }`}
            >
              <span className="text-lg text-purple-300">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-base text-rose-300 transition-colors hover:bg-purple-900 hover:text-rose-200"
          >
            <span className="text-lg">
              <HiOutlineLogout />
            </span>
            Terminar sessão
          </button>
        </div>
      </aside>
    </>
  );
}
