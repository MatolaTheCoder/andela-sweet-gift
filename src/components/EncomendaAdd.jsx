import React, { useEffect, useState } from 'react'
import InputGroup from './reusable/Input'
import axios from 'axios'
import { type } from '@testing-library/user-event/dist/type'

export default function EncomendaAdd() {
    const [produto, setProduto] = useState([])
    const [formData, setFormData] = useState({
        solicitante: '',
        endereco_destinatario: '',
        quantidade: '',
        data_criacao: '',
        data_entrega: '',
        id_produto: '',
        valor: '',
        destinatario: '',
    })

    useEffect(() => {
        axios.defaults.baseURL = 'http://localhost:8000'
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }, [])



    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('/api/products')
                setProduto(response.data)
            } catch (error) {
                console.log('Erro: ', error)
            }
        }
        fetchProdutos()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        const selectedProduto = produto.find((produto) => produto.id === parseInt(value));
        if (name === 'id_produto' && selectedProduto) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                valor: selectedProduto.preco,
            }));
        }
    }
    const inputs = [
        {
            label: "solicitante",
            name: "solicitante",
            value: formData.solicitante,
            onChange: handleInputChange,
        },
        {
            label: "Produto",
            name: "id_produto",
            value: formData.id_produto,
            onChange: handleInputChange,
            options: produto.map((produto) => ({
                value: produto.id,
                label: produto.nome,
            })),
        },
        {
            label: "valor",
            name: "valor",
            value: formData.valor,
            onChange: handleInputChange,
        },
        {
            label: "Data de Criacao",
            name: "data_criacao",
            value: formData.data_criacao,
            onChange: handleInputChange,
            type: 'date',
        },
    ]
    const inputs2 = [
        {
            label: "destinatario",
            name: "destinatario",
            value: formData.destinatario,
            onChange: handleInputChange,
        },
        {
            label: "quantidade",
            name: "quantidade",
            value: formData.quantidade,
            onChange: handleInputChange,
        },
        {
            label: "endereco",
            name: "endereco_destinatario",
            value: formData.endereco,
            onChange: handleInputChange,
        },
        {
            label: "Data de Entrega",
            name: "data_entrega",
            value: formData.data_entrega,
            onChange: handleInputChange,
            type: 'date',
        },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/orders', formData)
            alert('Encomenda registada com sucesso')
        } catch (error) {
            console.log('Erro: ', error)
        }
    }

    return (
        <div>
            <div className=' flex flex-col min-h-screen w-full'>
                <div className="title text-gray-700 flex text-lg p-4 font-semibold ">
                    <p className=''>Encomenda</p>
                </div>
                <div className="container w-full p-4 bg-white flex justify-center items-center ">
                    <form onSubmit={handleSubmit} method="post" className="w-full max-w-3xl p-6 ">
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
                            <button
                                type='submit'
                                className="w-60 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Registar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
