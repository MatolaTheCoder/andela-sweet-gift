import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineShoppingCart,
  HiOutlineSupport,
} from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';

const faqs = [
  {
    question: 'Como adiciono um novo produto?',
    answer:
      'Abra Produtos → Adicionar, preencha o nome, descrição, preço e data de criação e guarde. O produto fica imediatamente disponível na lista.',
  },
  {
    question: 'Como registo uma encomenda?',
    answer:
      'Em Encomendas → Adicionar escolha o produto, a quantidade e os dados do destinatário. O valor é calculado automaticamente a partir do preço do produto.',
  },
  {
    question: 'De onde vêm os clientes?',
    answer:
      'O diretório de clientes é agregado a partir das encomendas registadas (campo solicitante), com o total gasto e a última encomenda.',
  },
  {
    question: 'Posso alterar ou eliminar registos?',
    answer:
      'Sim. Cada linha das listas de produtos e encomendas tem ações de edição e eliminação. A eliminação é definitiva e pede confirmação.',
  },
  {
    question: 'Onde configuro a ligação à API?',
    answer:
      'A URL da API é lida de VITE_API_URL (por omissão http://localhost:8000). Pode consultar o valor ativo em Definições.',
  },
];

const shortcuts = [
  {
    to: '/produtos/add',
    label: 'Adicionar produto',
    icon: HiOutlineCube,
  },
  {
    to: '/encomendas/add',
    label: 'Adicionar encomenda',
    icon: HiOutlineShoppingCart,
  },
  {
    to: '/definicoes',
    label: 'Definições',
    icon: HiOutlineSupport,
  },
];

export default function Ajuda() {
  return (
    <div>
      <PageHeader
        breadcrumb="Suporte"
        title="Ajuda & Apoio"
        description="Respostas rápidas e atalhos para as tarefas mais comuns."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-neutral-800">Perguntas frequentes</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-neutral-800">
                  {faq.question}
                  <span className="text-neutral-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-neutral-500">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-neutral-800">Contactos</h2>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <a
                href="mailto:suporte@andelasweetgift.co.mz"
                className="flex items-center gap-2 text-neutral-700 hover:text-purple-700"
              >
                <HiOutlineMail className="text-lg text-purple-700" />
                suporte@andelasweetgift.co.mz
              </a>
              <a
                href="tel:+258840000000"
                className="flex items-center gap-2 text-neutral-700 hover:text-purple-700"
              >
                <HiOutlinePhone className="text-lg text-purple-700" />
                +258 84 000 0000
              </a>
              <p className="text-xs text-neutral-500">
                Segunda a sexta, 08:00 – 17:00.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-neutral-800">Atalhos</h2>
            </div>
            <div className="flex flex-col gap-1 p-3">
              {shortcuts.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-purple-800"
                >
                  <Icon className="text-lg text-purple-700" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
