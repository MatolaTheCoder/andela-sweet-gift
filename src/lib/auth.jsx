import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { HiOutlineLockClosed } from 'react-icons/hi';
import EmptyState from '../components/ui/EmptyState';
import { USER_UPDATED_EVENT, peekCurrentUser } from './api';
import { hasPermission } from './permissions';

/**
 * Utilizador atual e as suas permissões. Sem o provider (ex.: em testes
 * isolados) tudo é permitido.
 */
const AuthContext = createContext({ user: null, can: () => true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(peekCurrentUser);

  useEffect(() => {
    const refresh = () => setUser(peekCurrentUser());
    window.addEventListener(USER_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(USER_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const can = useCallback((permission) => hasPermission(user?.permissions, permission), [user]);
  const value = useMemo(() => ({ user, can }), [user, can]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/** Mostra o conteúdo só a quem tem a permissão; os outros veem uma explicação. */
export function RequirePermission({ permission, children }) {
  const { can } = useAuth();
  if (!permission || can(permission)) return children;
  return (
    <EmptyState
      icon={HiOutlineLockClosed}
      title="Sem permissão"
      message="A sua conta não tem acesso a esta área. Peça a um administrador para atribuir a permissão."
    />
  );
}
