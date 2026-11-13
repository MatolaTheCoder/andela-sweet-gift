import React, { useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import RowActions from '../../components/ui/RowActions';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import { SkeletonRows } from '../../components/ui/Skeleton';
import {
  createCollaborator,
  deleteCollaborator,
  getCollaborators,
  getErrorMessage,
  updateCollaborator,
} from '../../lib/api';
import { DEMO_CREDENTIALS } from '../../lib/mockData';
import { ALL_PERMISSIONS, PERMISSION_GROUPS, ROLES, permissionsForRole, roleLabel } from '../../lib/permissions';
import { initials } from '../../lib/format';

const ROLE_TONE = { administrador: 'brand', gestor: 'info', operador: 'neutral' };

/** Formulário de dados do colaborador (adicionar e editar). */
function CollaboratorForm({ initial, saving, error, onSubmit, onCancel }) {
  const editing = Boolean(initial?.id);
  const [values, setValues] = useState({
    nome: initial?.nome ?? '',
    email: initial?.email ?? '',
    cargo: initial?.cargo ?? '',
    role: initial?.role ?? 'operador',
    ativo: initial?.ativo ?? true,
  });

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const roleChanged = editing && values.role !== initial.role;
  const role = ROLES.find((item) => item.key === values.role);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        // Papel novo (ou colaborador novo): as permissões vêm do papel; editar o resto preserva-as.
        onSubmit({
          ...values,
          ...(!editing || roleChanged ? { permissions: permissionsForRole(values.role) } : {}),
        });
      }}
      className="space-y-4"
    >
      {error && <ErrorBanner message={error} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-nome" className="label">Nome *</label>
          <input id="c-nome" name="nome" className="input" value={values.nome} onChange={change} required />
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email *</label>
          <input id="c-email" name="email" type="email" className="input" value={values.email} onChange={change} required />
        </div>
        <div>
          <label htmlFor="c-cargo" className="label">Cargo</label>
          <input id="c-cargo" name="cargo" className="input" value={values.cargo} onChange={change} placeholder="Ex.: Atendimento" />
        </div>
        <div>
          <label htmlFor="c-role" className="label">Papel</label>
          <select id="c-role" name="role" className="input" value={values.role} onChange={change}>
            {ROLES.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-sm text-neutral-600">{role?.description}</p>
      {roleChanged && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
          Mudar o papel repõe as permissões do novo papel. Pode ajustá-las depois em “Permissões”.
        </p>
      )}
      {editing && (
        <label className="flex items-center gap-2 text-sm text-neutral-800">
          <input type="checkbox" name="ativo" checked={values.ativo} onChange={change} className="h-4 w-4 rounded border-control accent-purple-700" />
          Conta ativa (pode iniciar sessão)
        </label>
      )}
      {!editing && (
        <p className="text-sm text-neutral-600">
          Na demonstração, o novo colaborador entra com o seu email e a senha <strong>{DEMO_CREDENTIALS.password}</strong>.
        </p>
      )}
      <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'A guardar...' : editing ? 'Guardar alterações' : 'Adicionar colaborador'}
        </button>
      </div>
    </form>
  );
}

/** Matriz de permissões, agrupada por módulo, com atalhos por papel. */
function PermissionsEditor({ collaborator, saving, error, onSubmit, onCancel }) {
  const [selected, setSelected] = useState(() => new Set(collaborator.permissions));

  const toggle = (key) =>
    setSelected((current) => {
      const next = new Set(current);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const setGroup = (group, on) =>
    setSelected((current) => {
      const next = new Set(current);
      group.items.forEach((item) => (on ? next.add(item.key) : next.delete(item.key)));
      return next;
    });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit([...selected]);
      }}
      className="space-y-5"
    >
      {error && <ErrorBanner message={error} />}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-medium text-neutral-800">Aplicar papel:</span>
        {ROLES.map((role) => (
          <button key={role.key} type="button" className="link-action" onClick={() => setSelected(new Set(permissionsForRole(role.key)))}>
            {role.label}
          </button>
        ))}
        <span className="ml-auto text-neutral-600" aria-live="polite">
          {selected.size} de {ALL_PERMISSIONS.length} permissões
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PERMISSION_GROUPS.map((group) => {
          const all = group.items.every((item) => selected.has(item.key));
          return (
            <fieldset key={group.key} className="rounded-lg border border-neutral-200 p-4">
              <legend className="px-1 text-sm font-semibold text-neutral-900">{group.label}</legend>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 text-sm text-neutral-800">
                    <input
                      type="checkbox"
                      checked={selected.has(item.key)}
                      onChange={() => toggle(item.key)}
                      className="h-4 w-4 rounded border-control accent-purple-700"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
              <button type="button" className="link-action mt-3" onClick={() => setGroup(group, !all)}>
                {all ? 'Limpar grupo' : 'Selecionar grupo'}
              </button>
            </fieldset>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'A guardar...' : 'Guardar permissões'}
        </button>
      </div>
    </form>
  );
}

export default function Colaboradores() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // {type: 'form' | 'permissions', item?}
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [toRemove, setToRemove] = useState(null);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    getCollaborators()
      .then((data) => setItems(data ?? []))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Não foi possível carregar os colaboradores.')))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const sorted = useMemo(() => [...items].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')), [items]);
  const pagination = usePagination(sorted);

  const open = (next) => {
    setModalError('');
    setModal(next);
  };
  const close = () => !saving && setModal(null);

  const save = async (action, success) => {
    setSaving(true);
    setModalError('');
    try {
      const saved = await action();
      setItems((current) =>
        current.some((item) => item.id === saved.id)
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved]
      );
      setModal(null);
      setToast({ title: success.title, message: success.message(saved) });
    } catch (requestError) {
      setModalError(getErrorMessage(requestError, 'Não foi possível guardar.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = (item) =>
    updateCollaborator(item.id, { ativo: !item.ativo })
      .then((saved) => setItems((current) => current.map((other) => (other.id === saved.id ? saved : other))))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Não foi possível alterar o estado.')));

  const remove = async () => {
    try {
      await deleteCollaborator(toRemove.id);
      setItems((current) => current.filter((item) => item.id !== toRemove.id));
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível remover o colaborador.'));
    } finally {
      setToRemove(null);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Administração"
        title="Colaboradores"
        description="Quem trabalha na loja e o que cada pessoa pode fazer."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => open({ type: 'form' })}>
            <HiOutlinePlus /> Adicionar colaborador
          </button>
        }
      />

      <ErrorBanner message={error} onRetry={load} />

      {!error && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left" aria-busy={loading}>
              <thead className="bg-neutral-50">
                <tr>
                  <th className="th">Colaborador</th>
                  <th className="th">Cargo</th>
                  <th className="th">Papel</th>
                  <th className="th">Permissões</th>
                  <th className="th">Estado</th>
                  <th className="th text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading && <SkeletonRows rows={4} widths={['w-48', 'w-28', 'w-24', 'w-20', 'w-20', 'w-48']} lastRight />}
                {!loading &&
                  pagination.pageItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50">
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-semibold text-purple-700" aria-hidden="true">
                            {initials(item.nome)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-neutral-800">{item.nome}</p>
                            <p className="truncate text-xs text-neutral-600">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td">{item.cargo || '—'}</td>
                      <td className="td">
                        <StatusBadge status={roleLabel(item.role)} tone={ROLE_TONE[item.role] ?? 'neutral'} />
                      </td>
                      <td className="td">
                        {item.permissions.length} de {ALL_PERMISSIONS.length}
                      </td>
                      <td className="td">
                        <StatusBadge status={item.ativo ? 'Ativo' : 'Inativo'} tone={item.ativo ? 'success' : 'neutral'} />
                      </td>
                      <td className="td">
                        <RowActions
                          actions={[
                            { label: 'Permissões', onClick: () => open({ type: 'permissions', item }), ariaLabel: `Permissões de ${item.nome}` },
                            { label: 'Editar', onClick: () => open({ type: 'form', item }), ariaLabel: `Editar ${item.nome}` },
                            { label: item.ativo ? 'Desativar' : 'Ativar', onClick: () => toggleActive(item), ariaLabel: `${item.ativo ? 'Desativar' : 'Ativar'} ${item.nome}` },
                            { label: 'Remover', danger: true, onClick: () => setToRemove(item), ariaLabel: `Remover ${item.nome}` },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState title="Sem colaboradores" message="Adicione a primeira pessoa da equipa." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination {...pagination} />
        </div>
      )}

      <Modal
        open={modal?.type === 'form'}
        size="lg"
        title={modal?.item ? 'Editar colaborador' : 'Adicionar colaborador'}
        description={modal?.item ? modal.item.email : 'O papel define as permissões iniciais.'}
        onClose={close}
      >
        {modal?.type === 'form' && (
          <CollaboratorForm
            initial={modal.item}
            saving={saving}
            error={modalError}
            onCancel={close}
            onSubmit={(values) =>
              save(
                () => (modal.item ? updateCollaborator(modal.item.id, values) : createCollaborator(values)),
                {
                  title: modal.item ? 'Colaborador atualizado' : 'Colaborador adicionado',
                  message: (saved) => `${saved.nome} (${roleLabel(saved.role)}).`,
                }
              )
            }
          />
        )}
      </Modal>

      <Modal
        open={modal?.type === 'permissions'}
        size="xl"
        title="Permissões"
        description={modal?.item ? `${modal.item.nome} · ${roleLabel(modal.item.role)}` : ''}
        onClose={close}
      >
        {modal?.type === 'permissions' && (
          <PermissionsEditor
            collaborator={modal.item}
            saving={saving}
            error={modalError}
            onCancel={close}
            onSubmit={(permissions) =>
              save(() => updateCollaborator(modal.item.id, { permissions }), {
                title: 'Permissões atualizadas',
                message: (saved) => `${saved.nome}: ${saved.permissions.length} permissões.`,
              })
            }
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toRemove)}
        title="Remover colaborador"
        description={toRemove ? `Tem a certeza de que quer remover ${toRemove.nome}? Perde o acesso de imediato.` : ''}
        confirmLabel="Remover"
        onConfirm={remove}
        onCancel={() => setToRemove(null)}
      />

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
