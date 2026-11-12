import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { getErrorMessage, loginRequest } from '../../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      subtitle="Acede ao painel de gestão da Andela Sweet Gift."
      footer={
        <>
          Ainda não tens conta?{' '}
          <Link to="/registo" className="font-semibold text-purple-700 hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <ErrorBanner message={error} />}

        <div>
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

        <div>
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

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}
