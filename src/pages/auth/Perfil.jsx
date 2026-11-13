import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { Skeleton } from '../../components/ui/Skeleton';
import Alert from '../../components/ui/Alert';
import {
  changePassword,
  getCurrentUser,
  getErrorMessage,
  logoutRequest,
  updateProfile,
} from '../../lib/api';
import { initials } from '../../lib/format';

const EMPTY_PASSWORD = { atual: '', nova: '', confirmar: '' };

function Field({ label, loading = false, children }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="text-base font-medium text-neutral-900">
        {loading ? <Skeleton className="mt-1 h-5 w-36" /> : children || '—'}
      </dd>
    </div>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState(EMPTY_PASSWORD);
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((data) => active && setUser(data))
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Não foi possível carregar o perfil.'));
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const startEditing = () => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      telefone: user?.telefone ?? '',
      cargo: user?.cargo ?? '',
    });
    setFormError('');
    setEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      setUser(await updateProfile(form));
      setEditing(false);
      setToast({ title: 'Perfil atualizado', message: 'Os seus dados foram guardados.' });
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Não foi possível guardar o perfil.'));
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    if (passwords.nova !== passwords.confirmar) {
      setPasswordError('A confirmação não coincide com a nova senha.');
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({ atual: passwords.atual, nova: passwords.nova });
      setPasswords(EMPTY_PASSWORD);
      setToast({ title: 'Senha alterada', message: 'Use a nova senha no próximo início de sessão.' });
    } catch (requestError) {
      setPasswordError(getErrorMessage(requestError, 'Não foi possível alterar a senha.'));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logoutRequest();
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const changePwd = (event) =>
    setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }));

  const name = user?.name ?? 'Utilizador';

  return (
    <div>
      <PageHeader
        breadcrumb="Conta"
        title="Perfil"
        description="Os seus dados e a senha da conta."
      />

      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:items-start">
        <div className="flex flex-col gap-5 xl:col-span-2">
          {/* Dados pessoais */}
          <section className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Dados pessoais</h2>
              {!editing && !loading && (
                <button type="button" className="link-action" onClick={startEditing}>
                  Editar
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4 p-5">
                {formError && <ErrorBanner message={formError} />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label">Nome</label>
                    <input id="name" name="name" className="input" value={form.name} onChange={change} required />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input id="email" name="email" type="email" className="input" value={form.email} onChange={change} required />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="label">Telefone</label>
                    <input id="telefone" name="telefone" type="tel" className="input" value={form.telefone} onChange={change} />
                  </div>
                  <div>
                    <label htmlFor="cargo" className="label">Cargo</label>
                    <input id="cargo" name="cargo" className="input" value={form.cargo} onChange={change} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'A guardar...' : 'Guardar alterações'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center" aria-busy={loading}>
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-semibold text-purple-900"
                  aria-hidden="true"
                >
                  {loading ? null : initials(name) || 'A'}
                </div>
                <dl className="grid w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <Field label="Nome" loading={loading}>{name}</Field>
                  <Field label="Email" loading={loading}>{user?.email}</Field>
                  <Field label="Telefone" loading={loading}>{user?.telefone}</Field>
                  <Field label="Cargo" loading={loading}>{user?.cargo}</Field>
                </dl>
              </div>
            )}
          </section>

          {/* Senha */}
          <form onSubmit={handlePassword} className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Alterar senha</h2>
            </div>
            <div className="space-y-4 p-5">
              {passwordError && <ErrorBanner message={passwordError} />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="atual" className="label">Senha atual</label>
                  <input id="atual" name="atual" type="password" autoComplete="current-password" className="input" value={passwords.atual} onChange={changePwd} required />
                </div>
                <div>
                  <label htmlFor="nova" className="label">Nova senha</label>
                  <input id="nova" name="nova" type="password" autoComplete="new-password" minLength={8} className="input" value={passwords.nova} onChange={changePwd} required aria-describedby="nova-ajuda" />
                </div>
                <div>
                  <label htmlFor="confirmar" className="label">Confirmar nova senha</label>
                  <input id="confirmar" name="confirmar" type="password" autoComplete="new-password" className="input" value={passwords.confirmar} onChange={changePwd} required />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p id="nova-ajuda" className="text-sm text-neutral-600">Use pelo menos 8 caracteres.</p>
                <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                  {savingPassword ? 'A guardar...' : 'Guardar senha'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sessão */}
        <aside className="card" aria-label="Sessão">
          <div className="card-header">
            <h2 className="text-base font-semibold text-neutral-900">Sessão</h2>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-sm text-neutral-600">
              Termine a sessão neste dispositivo quando acabar. Terá de se autenticar novamente.
            </p>
            <button type="button" className="btn btn-danger w-full" onClick={handleLogout}>
              <HiOutlineLogout aria-hidden="true" /> Terminar sessão
            </button>
          </div>
        </aside>
      </div>

      <Alert
        open={Boolean(toast)}
        type="success"
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
        autoClose={3000}
      />
    </div>
  );
}
