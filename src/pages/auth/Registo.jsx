import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { getErrorMessage, registerRequest } from '../../lib/api';

export default function Registo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await registerRequest(form);
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível criar a conta.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Regista-te para começar a gerir a loja."
      footer={
        <>
          Já tens conta?{' '}
          <Link to="/login" className="font-semibold text-purple-700 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}

        <div>
          <label htmlFor="name" className="label">
            Nome
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="O teu nome"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="nome@exemplo.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="label">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label htmlFor="password_confirmation" className="label">
              Confirmar senha
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A criar conta...' : 'Criar conta'}
        </button>
      </form>
    </AuthLayout>
  );
}
