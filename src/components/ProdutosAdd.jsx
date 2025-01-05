import React, { useState } from 'react';
import InputGroup from './reusable/Input';

export default function ProdutosAdd() {
  const [formData, setFormData] = useState({
    nome_produto: '',
    preco: '',
    descricao: '',
    data_criacao: '',
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const inputs = [
    {
      label: "Nome do produto",
      name: "nome_produto",
      value: formData.nome_produto,
      onChange: handleInputChange,
    },
    {
      label: "Descricao",
      name: "descricao",
      value: formData.descricao,
      onChange: handleInputChange,
    },
  ]

  const inputs2 = [
    {
      label: "Preço do produto",
      name: "preco",
      value: formData.preco,
      onChange: handleInputChange,
    },
    {
      label: "Data de criacao",
      name: "data_criacao",
      value: formData.data_criacao,
      onChange: handleInputChange,
    },
  ]
  return (
    <div className=' flex flex-col min-h-screen w-full'>
      <div className="title text-gray-700 flex text-lg p-4 font-semibold ">
        <p className=''>Produtos</p>
      </div>
      <div className="container w-full p-4 bg-white flex justify-center items-center ">
        <form action="" method="post" className="w-full max-w-3xl p-6 ">
          <div>
            <div className="w-full flex justify-center text-gray-700 font-bold pb-5">
              <span>Adicionar produtos</span>
            </div>
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup inputs={inputs} />
                <InputGroup inputs={inputs2} />
              </div>
            </div>
          </div>
          <div className="flex justify-center p-8">
            <button className="w-60 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Registar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

