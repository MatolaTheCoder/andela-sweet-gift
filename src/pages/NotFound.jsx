import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-5xl font-bold text-purple-800">404</p>
      <h1 className="text-xl font-semibold text-neutral-900">Página não encontrada</h1>
      <p className="max-w-md text-sm text-neutral-500">
        O endereço que tentou abrir não existe ou foi movido.
      </p>
      <Link to="/" className="btn btn-primary mt-2">
        <HiOutlineHome /> Voltar ao dashboard
      </Link>
    </div>
  );
}
