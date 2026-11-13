import { useCallback, useEffect, useState } from 'react';
import { getOrders, getProducts } from './api';
import { formatDate } from './format';
import { isDueToday, isOverdue, stockLevel } from './orderStatus';

const READ_KEY = 'alertas:lidos';

/**
 * Alertas calculados a partir dos dados: entregas em atraso, entregas de hoje
 * e produtos com stock baixo ou esgotado. Cada alerta tem um id estável, para
 * se poder marcar como lido.
 */
export function buildAlerts(orders = [], products = [], can = () => true) {
  const alerts = [];

  if (can('encomendas.ver')) {
    orders.filter((order) => isOverdue(order)).forEach((order) =>
      alerts.push({
        id: `atraso-${order.id}`,
        tone: 'danger',
        title: `Encomenda #${order.id} em atraso`,
        detail: `Devia ter sido entregue a ${formatDate(order.data_entrega)} · ${order.destinatario}`,
        to: '/encomendas/list?estado=atraso',
      })
    );
    orders.filter((order) => isDueToday(order)).forEach((order) =>
      alerts.push({
        id: `hoje-${order.id}`,
        tone: 'warning',
        title: `Entrega hoje: encomenda #${order.id}`,
        detail: `${order.destinatario} · ${order.endereco_destinatario}`,
        to: '/calendario',
      })
    );
  }

  if (can('produtos.ver')) {
    products.forEach((product) => {
      const level = stockLevel(product);
      if (level.key === 'ok') return;
      alerts.push({
        id: `stock-${product.id}-${level.key}`,
        tone: level.key === 'sem' ? 'danger' : 'warning',
        title: level.key === 'sem' ? `${product.nome}: sem stock` : `${product.nome}: stock baixo`,
        detail: level.key === 'sem' ? 'Esgotado. Reponha o stock.' : `Restam ${product.stock} un. (mínimo ${product.stock_minimo}).`,
        to: `/produtos/list?stock=${level.key}`,
      });
    });
  }

  return alerts;
}

const readIds = () => {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) ?? '[]') ?? [];
  } catch {
    return [];
  }
};

/** Alertas atuais + estado de leitura (guardado no navegador). */
export function useAlerts(can) {
  const [alerts, setAlerts] = useState([]);
  const [read, setRead] = useState(readIds);

  const refresh = useCallback(() => {
    Promise.all([getOrders(), getProducts()])
      .then(([orders, products]) => setAlerts(buildAlerts(orders ?? [], products ?? [], can)))
      .catch(() => {});
  }, [can]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 60000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const persist = (ids) => {
    setRead(ids);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(ids));
    } catch {
      /* ignora */
    }
  };

  const markRead = (id) => persist([...new Set([...read, id])]);
  const markAllRead = () => persist([...new Set([...read, ...alerts.map((alert) => alert.id)])]);
  const unread = alerts.filter((alert) => !read.includes(alert.id));

  return { alerts, read, unread, refresh, markRead, markAllRead };
}
