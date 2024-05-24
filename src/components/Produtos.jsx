// Produtos.js
import React from 'react';
import { Link } from 'react-router-dom';
import { data_produts } from '../lib/data';
import { MdModeEdit,MdDelete } from 'react-icons/md';
const Produtos = () => {
  return (
    <div>
      <div className='bg-white flex flex-col items-center min-h-screen'>
        <div className="title text-gray-700 flex w-full text-lg p-4 font-semibold">
          <p className=''>Produtos</p>
        </div>
        <div className="p-4 ">
          <table className='w-fit border-collapse border border-gray-200'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='p-4'>Codigo</th>
                <th className='p-4'>Nome do produto</th>
                <th className='p-4'>Categoria</th>
                <th className='p-4'>Data de criação</th>
                <th className='p-4'>Preço do produto</th>
                <th className='p-4'>Operação</th>
              </tr>
            </thead>
            <tbody>
              {data_produts.map((data)=>(
                <tr className='bg-white text-center'>
                  <td className='p-4'>{data.id}</td>
                  <td className='p-4'>{data.prod_name}</td>
                  <td className='p-4'>{data.prod_categoria}</td>
                  <td className='p-4'>{data.prod_Date}</td>
                  <td className='p-4'>{data.prod_price}</td>
                  <td className='p-4 ml-5 text-xl flex gap-1'><Link className='hover:text-2xl text-sky-500'><MdModeEdit/></Link><Link className='hover:text-2xl text-red-500'><MdDelete/></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <button className='text-white bg-sky-500 rounded-md p-2 text-sm flex'><Link to="/produtos/add">Adicionar</Link></button>
        </div>
      </div>
      
      
    </div>
  );
}

export default Produtos;
