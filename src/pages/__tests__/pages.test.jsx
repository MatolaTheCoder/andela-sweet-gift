import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import Produtos from '../produtos/Produtos';
import Encomenda from '../encomendas/Encomenda';
import Recibo from '../encomendas/Recibo';
import Perfil from '../auth/Perfil';
import Definicoes from '../definicoes/Definicoes';
import Colaboradores from '../colaboradores/Colaboradores';
import Calendario from '../calendario/Calendario';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import { permissionsForRole } from '../../lib/permissions';
import { brandEmail } from '../../lib/brand';
import { loginAs, renderApp } from '../../test/utils';

const operador = {
  id: 3,
  name: 'Armando Zunguze',
  email: brandEmail('armando'),
  role: 'operador',
  permissions: permissionsForRole('operador'),
};

function PagedList({ count }) {
  const items = Array.from({ length: count }, (_, index) => `Linha ${index + 1}`);
  const pagination = usePagination(items);
  return (
    <>
      <ul>
        {pagination.pageItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Pagination {...pagination} />
    </>
  );
}

describe('paginação', () => {
  it('mostra no máximo 10 por página e muda de página', async () => {
    renderApp(<PagedList count={25} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getByText('1–10 de 25')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Página seguinte' }));
    expect(screen.getByText('Linha 11')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('não mostra o rodapé quando cabe tudo numa página', () => {
    renderApp(<PagedList count={4} />);
    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument();
  });
});

describe('produtos', () => {
  it('lista, filtra por stock e regista um produto novo', async () => {
    renderApp(<Produtos />);
    expect(await screen.findByText('Chávena personalizada')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Filtros/ }));
    await userEvent.click(screen.getByRole('radio', { name: /Sem stock/ }));
    expect(screen.getByText('Caixa surpresa')).toBeInTheDocument();
    expect(screen.queryByText('Chávena personalizada')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Remover filtro Stock/ }));

    await userEvent.click(screen.getByRole('button', { name: /Adicionar produto/ }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText(/Nome do produto/), 'Vela perfumada');
    await userEvent.type(within(dialog).getByLabelText(/Preço/), '320');
    await userEvent.selectOptions(within(dialog).getByLabelText('Categoria'), 'Casa');
    await userEvent.type(within(dialog).getByLabelText('Descrição'), 'Vela de soja');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Registar produto' }));

    expect(await screen.findByText('Produto registado')).toBeInTheDocument();
    expect(screen.getAllByText('Vela perfumada').length).toBeGreaterThan(0);
  });

  it('a pré-visualização acompanha o que se escreve', async () => {
    renderApp(<Produtos />);
    await screen.findByText('Chávena personalizada');
    await userEvent.click(screen.getByRole('button', { name: /Adicionar produto/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Nome do produto', { selector: 'h3' })).toBeInTheDocument();
    await userEvent.type(within(dialog).getByLabelText(/Nome do produto/), 'Quadro novo');
    expect(within(dialog).getByRole('heading', { name: 'Quadro novo' })).toBeInTheDocument();
  });

  it('um operador não vê adicionar, editar nem eliminar', async () => {
    loginAs(operador);
    renderApp(<Produtos />);
    await screen.findByText('Chávena personalizada');
    expect(screen.queryByRole('button', { name: /Adicionar produto/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Editar/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Eliminar/ })).not.toBeInTheDocument();
  });
});

describe('encomendas', () => {
  it('filtra por estado e atualiza o estado de uma encomenda', async () => {
    renderApp(<Encomenda />);
    expect(await screen.findByText('#68')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Filtros/ }));
    await userEvent.click(screen.getByRole('radio', { name: /Em atraso/ }));
    expect(screen.getAllByRole('row')).toHaveLength(2); // cabeçalho + 1 encomenda em atraso

    await userEvent.click(screen.getByRole('button', { name: /Remover filtro Estado/ }));
    const row = screen.getByText('#68').closest('tr');
    await userEvent.click(within(row).getByRole('button', { name: /Atualizar estado/ }));

    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('radio', { name: /Entregue/ }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Guardar estado' }));

    expect(await screen.findByText('Estado atualizado')).toBeInTheDocument();
    expect(within(screen.getByText('#68').closest('tr')).getByText('Entregue')).toBeInTheDocument();
  });

  it('um operador pode atualizar o estado mas não eliminar', async () => {
    loginAs(operador);
    renderApp(<Encomenda />);
    await screen.findByText('#68');
    expect(screen.getAllByRole('button', { name: /Atualizar estado/ }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /Eliminar/ })).not.toBeInTheDocument();
  });
});

describe('recibo', () => {
  const ui = (
    <Routes>
      <Route path="/encomendas/:id/recibo" element={<Recibo />} />
    </Routes>
  );

  it('alterna entre recibo e guia de entrega', async () => {
    renderApp(ui, { route: '/encomendas/68/recibo' });
    expect(await screen.findByRole('article', { name: /REC-2026-0068/ })).toBeInTheDocument();
    expect(screen.getByText('Subtotal (sem IVA)')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Guia de entrega' }));
    expect(screen.getByRole('article', { name: /GUIA-2026-0068/ })).toBeInTheDocument();
    expect(screen.queryByText('Subtotal (sem IVA)')).not.toBeInTheDocument();
  });

  it('avança o estado e mostra o carimbo de entregue', async () => {
    renderApp(ui, { route: '/encomendas/68/recibo' });
    await userEvent.click(await screen.findByRole('button', { name: /Avançar para/ }));
    expect(await screen.findByText('Entregue', { selector: 'span.stamp-in' })).toBeInTheDocument();
  });
});

describe('colaboradores', () => {
  it('adiciona um colaborador e abre as permissões', async () => {
    renderApp(<Colaboradores />);
    expect(await screen.findByText('Helena Matsinhe')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Adicionar colaborador/ }));
    const form = await screen.findByRole('dialog');
    await userEvent.type(within(form).getByLabelText(/Nome/), 'Rita Mabote');
    await userEvent.type(within(form).getByLabelText(/Email/), brandEmail('rita'));
    await userEvent.click(within(form).getByRole('button', { name: 'Adicionar colaborador' }));
    expect(await screen.findByText('Colaborador adicionado')).toBeInTheDocument();

    const row = screen.getByText('Rita Mabote').closest('tr');
    await userEvent.click(within(row).getByRole('button', { name: /Permissões de/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('5 de 15 permissões')).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Ver indicadores' }));
    expect(within(dialog).getByText('6 de 15 permissões')).toBeInTheDocument();
  });
});

describe('acessibilidade (axe)', () => {
  // O contraste de cor é medido no navegador real (jsdom não calcula estilos); aqui
  // verificam-se nomes, rótulos, papéis ARIA, estrutura e foco.
  const check = async (container) => {
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
    const summary = results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(' | ')}`);
    expect(summary).toEqual([]);
  };

  it('Perfil', async () => {
    const { container } = renderApp(<Perfil />);
    await screen.findByText('Dados pessoais');
    await check(container);
  });

  it('Definições', async () => {
    const { container } = renderApp(<Definicoes />);
    await screen.findByText('Dados da loja');
    await check(container);
  });

  it('Produtos', async () => {
    const { container } = renderApp(<Produtos />);
    await screen.findByText('Chávena personalizada');
    await check(container);
  });

  it('Produtos com o modal aberto', async () => {
    const { baseElement } = renderApp(<Produtos />);
    await screen.findByText('Chávena personalizada');
    await userEvent.click(screen.getByRole('button', { name: /Adicionar produto/ }));
    await screen.findByRole('dialog');
    await check(baseElement);
  });

  it('Encomendas', async () => {
    const { container } = renderApp(<Encomenda />);
    await screen.findByText('#68');
    await check(container);
  });

  it('Colaboradores', async () => {
    const { container } = renderApp(<Colaboradores />);
    await screen.findByText('Helena Matsinhe');
    await check(container);
  });

  it('Calendário', async () => {
    const { container } = renderApp(<Calendario />);
    await screen.findByText('Calendário de entregas');
    await screen.findAllByRole('button', { name: /entrega\(s\)/ });
    await check(container);
  });

  it('Recibo', async () => {
    const { container } = renderApp(
      <Routes>
        <Route path="/encomendas/:id/recibo" element={<Recibo />} />
      </Routes>,
      { route: '/encomendas/68/recibo' }
    );
    await screen.findByRole('article');
    await check(container);
  });
});
