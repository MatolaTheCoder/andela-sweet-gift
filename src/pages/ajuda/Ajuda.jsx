import { brandEmail } from '../../lib/brand';
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
      'Os produtos podem ser editados e eliminados. As encomendas não se editam: podem ser eliminadas e registadas de novo. A eliminação é definitiva e pede confirmação.',
  },
  {
    question: 'De onde vêm os dados?',
    answer:
      'Nesta versão de demonstração os dados são simulados e ficam guardados no navegador. Pode repô-los em Definições.',
  },
];

const shortcuts = [
  {
    to: '/produtos/list?novo=1',
    label: 'Adicionar produto',
    icon: HiOutlineCube,
  },
  {
    to: '/encomendas/list?novo=1',
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
            <h2 className="text-base font-semibold text-neutral-900">Perguntas frequentes</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-neutral-800">
                  {faq.question}
                  <span className="text-neutral-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Contactos</h2>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <a
                href={`mailto:${brandEmail('suporte')}`}
                className="flex items-center gap-2 text-neutral-700 hover:text-purple-700"
              >
                <HiOutlineMail className="text-lg text-purple-700" />
                {brandEmail('suporte')}
              </a>
              <a
                href="tel:+258840000000"
                className="flex items-center gap-2 text-neutral-700 hover:text-purple-700"
              >
                <HiOutlinePhone className="text-lg text-purple-700" />
                +258 84 000 0000
              </a>
              <p className="text-xs text-neutral-600">
                Segunda a sexta, 08:00 – 17:00.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Atalhos</h2>
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
