import React, { useState } from 'react';
import { HiOutlineCog, HiOutlineRefresh } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import { resetMockData } from '../../lib/api';
import { brandEmail } from '../../lib/brand';
import { CURRENCIES, formatCurrency } from '../../lib/format';
import { SETTINGS_DEFAULTS, useSettings } from '../../lib/settings';
import { useTheme } from '../../lib/theme';

const THEMES = [
  { key: 'light', label: 'Claro' },
  { key: 'dark', label: 'Escuro' },
  { key: 'system', label: 'Sistema' },
];

const SAVED_FLAG = 'definicoes:salvo';

export default function Definicoes() {
  const { preference, setTheme } = useTheme();
  const { settings, saveSettings, resetSettings } = useSettings();
  const [values, setValues] = useState(settings);
  // Mudar a moeda refaz a aplicação; o aviso sobrevive a isso através de um sinal temporário.
  const [saved, setSaved] = useState(() => {
    const flag = sessionStorage.getItem(SAVED_FLAG);
    sessionStorage.removeItem(SAVED_FLAG);
    return flag;
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currencyChanged = values.moeda !== settings.moeda;
    if (currencyChanged) sessionStorage.setItem(SAVED_FLAG, 'As definições foram guardadas.');
    saveSettings({ ...values, empresa: values.empresa.trim() || settings.empresa });
    if (!currencyChanged) setSaved('As definições foram guardadas.');
  };

  const handleReset = () => {
    sessionStorage.setItem(SAVED_FLAG, 'Definições repostas para os valores iniciais.');
    resetSettings();
    setValues(SETTINGS_DEFAULTS);
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Configurações"
        title="Definições"
        description="Estas escolhas aplicam-se a toda a aplicação, neste navegador."
        actions={
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <HiOutlineRefresh /> Restaurar
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <form className="card xl:col-span-2" onSubmit={handleSubmit}>
          <div className="card-header">
            <h2 className="text-base font-semibold text-neutral-900">Dados da loja</h2>
            <HiOutlineCog className="text-neutral-500" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="empresa" className="label">Nome da loja</label>
              <input id="empresa" name="empresa" className="input" value={values.empresa} onChange={handleChange} aria-describedby="empresa-ajuda" />
              <p id="empresa-ajuda" className="mt-1 text-sm text-neutral-600">Aparece na barra lateral, no título da página e nos recibos.</p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="label">Email de contacto</label>
              <input id="email" name="email" type="email" className="input" placeholder={brandEmail('geral')} value={values.email} onChange={handleChange} aria-describedby="email-ajuda" />
              <p id="email-ajuda" className="mt-1 text-sm text-neutral-600">Mostrado no cabeçalho e no rodapé dos recibos.</p>
            </div>

            <div>
              <label htmlFor="moeda" className="label">Moeda</label>
              <select id="moeda" name="moeda" className="input" value={values.moeda} onChange={handleChange} aria-describedby="moeda-ajuda">
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>{currency.label}</option>
                ))}
              </select>
              <p id="moeda-ajuda" className="mt-1 text-sm text-neutral-600">
                Os valores guardam-se em MZN; USD e EUR usam taxas fixas de demonstração (1 USD = 64 MZN, 1 EUR = 70 MZN).
              </p>
            </div>

            <div>
              <label htmlFor="porPagina" className="label">Registos por página</label>
              <select id="porPagina" name="porPagina" className="input" value={values.porPagina} onChange={handleChange} aria-describedby="pagina-ajuda">
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              <p id="pagina-ajuda" className="mt-1 text-sm text-neutral-600">Tamanho das páginas em todas as listas (máximo 10).</p>
            </div>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                name="notificacoes"
                checked={values.notificacoes}
                onChange={handleChange}
                className="h-4 w-4 rounded border-control text-purple-700 accent-purple-700 focus:ring-purple-300"
              />
              <span className="text-sm text-neutral-700">Mostrar alertas no sino (entregas de hoje, atrasos e stock)</span>
            </label>

            <p className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700 sm:col-span-2">
              Exemplo de valor: <strong>{formatCurrency(1299)}</strong> (moeda atual). Guarde para aplicar a nova escolha.
            </p>
          </div>

          <div className="flex justify-end border-t border-neutral-200 px-5 py-4">
            <button type="submit" className="btn btn-primary">Guardar definições</button>
          </div>
        </form>

        <div className="flex flex-col gap-5">
          <section className="card h-fit">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Aparência</h2>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-neutral-600">Escolha o tema. "Sistema" acompanha a definição do seu computador.</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Tema">
                {THEMES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={preference === item.key}
                    onClick={() => setTheme(item.key)}
                    className={`btn ${preference === item.key ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="card h-fit">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Dados de demonstração</h2>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-neutral-600">
                A aplicação usa dados simulados, guardados apenas neste navegador.
              </p>
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => {
                  resetMockData();
                  setSaved('Dados de demonstração repostos.');
                }}
              >
                <HiOutlineRefresh /> Repor dados iniciais
              </button>
            </div>
          </div>
        </div>
      </div>

      <Alert
        open={Boolean(saved)}
        type="success"
        title="Definições"
        message={saved || ''}
        onClose={() => setSaved(null)}
        autoClose={3000}
      />
    </div>
  );
}
