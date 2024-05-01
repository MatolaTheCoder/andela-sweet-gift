import React from 'react';

export default function ProdutosAdd() {
  return (
    <div className="container w-full p-4 bg-white">
      <form action="" method="post">
        <div className="">
          <div className="flex justify-center text-gray-700 font-bold pb-5">
          <span>Adicionar produtos</span>
        </div>
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label1="Nome do produto" label2="Categoria" label3="Data de criação" />
            <InputGroup label1="Preço do produto" label2="Produto Backlog" label3="Produto Terciários" />
          </div>
          
          </div>
        </div>
        <div className="flex justify-center mt-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Adicionar Produto
            </button>
          </div>
      </form>
      
    </div>
  );
}

function InputGroup({ label1, label2, label3 }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <InputWrapper label={label1} />
      {label2 && <InputWrapper label={label2} />}
      {label3 && <InputWrapper label={label3} />}
    </div>
  );
}

function InputWrapper({ label }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="text"
        placeholder={label}
        className="w-full px-4 py-2 border border-gray-400 outline-gray-300 text-gray-600 rounded"
      />
    </div>
  );
}
