import { Link } from 'react-router-dom';
import { data_produts } from '../lib/data';
import { MdModeEdit,MdDelete } from 'react-icons/md';
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
const Produtos = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className='bg-white flex flex-col items-center min-h-screen'>
        <div className="title text-gray-700 flex justify-center w-full text-lg p-4 font-semibold ">
          <p className=''>Produtos</p>
        </div>
        <div className="p-4 ">
          <table className='w-fit border-collapse border border-gray-200'>
            <thead className='bg-gray-600 text-white'>
              <tr className=''>
                <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>Codigo</th>
                <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>Nome do produto</th>
                <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>Categoria</th>
                <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>Data de criação</th>
                <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>Preço do produto</th>
                <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>Operação</th>
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
                  <td className='p-4 ml-5 text-xl flex gap-1'>
                    <Link className='hover:text-2xl text-sky-500'><MdModeEdit/></Link>
                    <button className='hover:text-2xl text-red-500' onClick={()=>setIsOpen(true)}><MdDelete/></button>
                    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                      <div className="fixed inset-0 bg-black bg-opacity-30"></div>  {/* Background overlay */}
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="max-w-lg w-full space-y-4 border bg-white p-12">
                          <Dialog.Title className="font-bold text-lg">Eliminar produto</Dialog.Title>
                          <Dialog.Description className="text-gray-500">
                            Isso nao pode ser revertido
                          </Dialog.Description>
                          <p>Voce tem a certeza de que deseja eliminar esse produto?</p>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => setIsOpen(false)} 
                              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => setIsOpen(false)} 
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Eliminar
                            </button>
                          </div>
                        </Dialog.Panel>
                      </div>
                    </Dialog>
                  </td>
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
