import React, { useState } from 'react';
import { HiOutlineCog, HiOutlineRefresh } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import api from '../../lib/api';

const STORAGE_KEY = 'definicoes';
const DEFAULTS = {
  empresa: 'Andela Sweet Gift',
  email: '',
  moeda: 'MZN',
  notificacoes: true,
  porPagina: '10',
};

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return stored ? { ...DEFAULTS, ...stored } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function Definicoes() {
  const [settings, setSettings] = useState(readSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULTS);
    setSaved(true);
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Configurações"
        title="Definições"
        description="Preferências da loja guardadas neste dispositivo."
        actions={
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <HiOutlineRefresh /> Restaurar
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <form className="card xl:col-span-2" onSubmit={handleSubmit}>
          <div className="card-header">
            <h2 className="text-sm font-semibold text-neutral-800">Dados da loja</h2>
            <HiOutlineCog className="text-neutral-400" />
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="empresa" className="label">
                Nome da loja
              </label>
              <input
                id="empresa"
                name="empresa"
                className="input"
                value={settings.empresa}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="label">
                Email de contacto
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="geral@andelasweetgift.co.mz"
                value={settings.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="moeda" className="label">
                Moeda
              </label>
              <select
                id="moeda"
                name="moeda"
                className="input"
                value={settings.moeda}
                onChange={handleChange}
              >
                <option value="MZN">Metical (MZN)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label htmlFor="porPagina" className="label">
                Registos por página
              </label>
              <select
                id="porPagina"
                name="porPagina"
                className="input"
                value={settings.porPagina}
                onChange={handleChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                name="notificacoes"
                checked={settings.notificacoes}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-purple-700 focus:ring-purple-300"
              />
              <span className="text-sm text-neutral-700">
                Receber notificações por email
              </span>
            </label>
          </div>

          <div className="flex justify-end border-t border-neutral-200 px-5 py-4">
            <button type="submit" className="btn btn-primary">
              Guardar definições
            </button>
          </div>
        </form>

        <div className="card h-fit">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-neutral-800">Ligação à API</h2>
          </div>
          <div className="space-y-3 p-5">
            <p className="text-sm text-neutral-500">
              Endereço definido em <code className="rounded bg-neutral-100 px-1">VITE_API_URL</code>.
            </p>
            <p className="break-all rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-700">
              {api.defaults.baseURL}
            </p>
            <p className="text-xs text-neutral-500">
              Altere o ficheiro <code>.env</code> e reinicie o servidor para aplicar.
            </p>
          </div>
        </div>
      </div>

      <Alert
        open={saved}
        type="success"
        title="Definições guardadas"
        message="As preferências foram guardadas neste dispositivo."
        onClose={() => setSaved(false)}
        autoClose={3000}
      />
    </div>
  );
}
