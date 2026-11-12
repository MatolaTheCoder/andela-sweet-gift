import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { data_popular_product } from '../../lib/data';

function PopularProducts() {
  return (
    <div className="card flex h-full flex-col">
      <div className="card-header">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800">Produtos populares</h2>
          <p className="text-xs text-neutral-500">Sugestões com maior procura.</p>
        </div>
        <Link
          to="/produtos/list"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900"
        >
          Ver todos <HiOutlineArrowRight />
        </Link>
      </div>

      <ul className="divide-y divide-neutral-100">
        {data_popular_product.map((product) => (
          <li key={product.id} className="flex items-center gap-3 px-5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-xs font-semibold text-purple-700">
              {product.prod_name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-800">{product.prod_name}</p>
              <p className="text-xs text-neutral-500">{product.prod_price}</p>
            </div>
            <span className="chip bg-emerald-50 text-emerald-700 ring-emerald-200">
              {product.prod_stock} un.
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularProducts;
