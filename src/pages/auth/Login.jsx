import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Criação de conta desativada por agora:
// import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { getErrorMessage, loginRequest } from '../../lib/api';
import { DEMO_CREDENTIALS } from '../../lib/mockData';
import { brandEmail } from '../../lib/brand';
import { useSettings } from '../../lib/settings';

export default function Login() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await loginRequest({ email, password });
      if (!data?.token) {
        setError('Credenciais inválidas. Tente novamente.');
        return;
      }
      localStorage.setItem('token', data.token);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, 'Não foi possível iniciar sessão. Verifique os dados.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Entrar na conta"
      subtitle={`Acede ao painel de gestão da ${settings.empresa}.`}
      /* Criação de conta desativada por agora. Para reativar, descomente este bloco,
         o import de Link acima e as rotas /registo em App.jsx.
      footer={
        <>
          Ainda não tens conta?{' '}
          <Link to="/registo" className="font-semibold text-purple-700 underline underline-offset-4">
            Criar conta
          </Link>
        </>
      }
      */
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <ErrorBanner message={error} />}

        <div className="fade-up rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-950" style={{ animationDelay: '120ms' }}>
          <p className="font-semibold">Acesso de demonstração</p>
          <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            <dt className="text-purple-800">Email:</dt>
            <dd className="break-all font-mono font-medium">{DEMO_CREDENTIALS.email}</dd>
            <dt className="text-purple-800">Senha:</dt>
            <dd className="font-mono font-medium">{DEMO_CREDENTIALS.password}</dd>
          </dl>
          <p className="mt-2 border-t border-purple-200 pt-2 text-xs">
            Outros perfis (mesma senha): <span className="font-mono">{brandEmail('helena')}</span> (gestora) e{' '}
            <span className="font-mono">{brandEmail('armando')}</span> (operador).
          </p>
        </div>

        <div className="fade-up" style={{ animationDelay: '200ms' }}>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input"
            placeholder="nome@exemplo.com"
            required
          />
        </div>

        <div className="fade-up" style={{ animationDelay: '280ms' }}>
          <label htmlFor="password" className="label">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary fade-up w-full py-2.5 shadow-lg shadow-purple-900/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          style={{ animationDelay: '360ms' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}
