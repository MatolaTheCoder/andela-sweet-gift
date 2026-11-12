import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineShieldCheck } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { getCurrentUser, getErrorMessage, logoutRequest } from '../../lib/api';
import { initials } from '../../lib/format';

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Não foi possível carregar o perfil.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutRequest();
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const name = user?.name ?? 'Utilizador';

  return (
    <div>
      <PageHeader
        breadcrumb="Conta"
        title="Perfil"
        description="Dados da conta com que iniciou sessão."
      />

      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-neutral-800">Dados pessoais</h2>
          </div>

          <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-semibold text-purple-800">
              {loading ? '…' : initials(name) || 'A'}
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Nome</p>
                <p className="text-sm font-medium text-neutral-800">
                  {loading ? 'A carregar...' : name}
                </p>
              </div>
              <div>
                <p className="label">Email</p>
                <p className="text-sm font-medium text-neutral-800">
                  {loading ? 'A carregar...' : user?.email ?? '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 px-5 py-4">
            <p className="text-xs text-neutral-500">
              A edição de dados de perfil e alteração de senha ainda não está disponível na API.
            </p>
          </div>
        </div>

        <div className="card h-fit">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-neutral-800">Sessão</h2>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <HiOutlineShieldCheck className="text-lg" />
              Sessão ativa
            </div>
            <p className="text-sm text-neutral-500">
              Termine a sessão neste dispositivo. Será necessário autenticar-se novamente.
            </p>
            <button type="button" className="btn btn-danger w-full" onClick={handleLogout}>
              <HiOutlineLogout /> Terminar sessão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
