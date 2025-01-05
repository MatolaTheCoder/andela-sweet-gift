import React, { useState } from 'react'
import InputGroup from './reusable/Input'

export default function EncomendaAdd() {
    const [produto, setProduto] = useState([]);
    const [formData, setFormData] = useState({
        solicitante: '',
        destinatatio: '',
        quantidade: '',
        data_criacao: '',
        data_entrega: '',
        id_produto: '',
    });
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const inputs = [
        {
            label: "solicitante",
            name: "solicitante",
            value: formData.solicitante,
            onChange: handleInputChange,
        },
        {
            label: "Produto",
            name: "produto",
            value: formData.id_produto,
            onChange: handleInputChange,
            options: produto.map((produto) => ({
                value: produto.id,
                label: produto.nome,
            })),
        },
        {
            label: "Data de Criacao",
            name: "data_criacao",
            value: formData.data_criacao,
            onChange: handleInputChange,
        },
    ]
    const inputs2 = [
        {
            label: "destinatatio",
            name: "destinatatio",
            value: formData.destinatatio,
            onChange: handleInputChange,
        },
        {
            label: "quantidade",
            name: "quantidade",
            value: formData.quantidade,
            onChange: handleInputChange,
        },
        {
            label: "Data de Entrega",
            name: "data_entrega",
            value: formData.data_entrega,
            onChange: handleInputChange,
        },
    ]
    return (
        <div>
            <div className=' flex flex-col min-h-screen w-full'>
                <div className="title text-gray-700 flex text-lg p-4 font-semibold ">
                    <p className=''>Encomenda</p>
                </div>
                <div className="container w-full p-4 bg-white flex justify-center items-center ">
                    <form action="" method="post" className="w-full max-w-3xl p-6 ">
                        <div>
                            <div className="w-full flex justify-center text-gray-800 font-semibold pb-5">
                                <span className='text-lg'>Registar Encomenda</span>
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
        </div>
    )
}
