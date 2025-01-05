import React from 'react';
import InputGroup from './reusable/Input';

export default function ProdutosAdd() {
  return (
    <div className=' flex flex-col min-h-screen w-full'>
      <div className="title text-gray-700 flex text-lg p-4 font-semibold ">
        <p className=''>Produtos</p>
      </div>
      <div className="container w-full p-4 bg-white flex justify-center items-center ">
        <form action="" method="post" className="w-full max-w-3xl p-6 shadow-lg">
          <div>
            <div className="w-full flex justify-center text-gray-700 font-bold pb-5">
              <span>Adicionar produtos</span>
            </div>
            <div className="w-full m-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label1="Nome do produto" label2="Descricao" />
                <InputGroup label1="Preço do produto" label2="Data de criacao"/>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-8">
            <button className="w-4/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Adicionar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

