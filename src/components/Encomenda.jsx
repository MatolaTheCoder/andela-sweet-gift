import { Dialog } from '@headlessui/react';
import React, { useState } from 'react'
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Encomenda() {
    const recentData = [
        {
            id: '1',
            productId: 'PROD001',
            customerName: 'Alice Smith',
            orderDate: '2024-04-21:09:30',
            orderTotal: '850MZN',
            orderStatus: 'pending',
            address: '123 Main Street'
        },
        {
            id: '2',
            productId: 'PROD002',
            customerName: 'Bob Johnson',
            orderDate: '2024-04-20:15:45',
            orderTotal: '1200MZN',
            orderStatus: 'pending',
            address: '456 Elm Avenue'
        },
        {
            id: '3',
            productId: 'PROD003',
            customerName: 'Eve Brown',
            orderDate: '2024-04-19:12:00',
            orderTotal: '2100MZN',
            orderStatus: 'delivered',
            address: '789 Oak Road'
        },
        {
            id: '4',
            productId: 'PROD004',
            customerName: 'Charlie Davis',
            orderDate: '2024-04-18:18:20',
            orderTotal: '1750MZN',
            orderStatus: 'Ccncelled',
            address: '1011 Pine Lane'
        },
        {
            id: '5',
            productId: 'PROD005',
            customerName: 'Charlie Davis',
            orderDate: '2024-04-18:18:20',
            orderTotal: '1750MZN',
            orderStatus: 'delivered',
            address: '1011 Pine Lane'
        },
        {
            id: '6',
            productId: 'PROD006',
            customerName: 'Charlie Davis',
            orderDate: '2024-04-18:18:20',
            orderTotal: '1750MZN',
            orderStatus: 'cancelled',
            address: '1011 Pine Lane'
        }
    ];
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <div className=' flex flex-col min-h-screen w-full'>
                <div className="title text-gray-700 flex text-lg p-4 font-semibold ">
                    <p className=''>Encomendas</p>
                </div>
                <div className="w-full bg-white">
                    <p className="p-4 text-gray-700 font-semibold text-lg mb-4">| Lista de encomendas</p>
                    <div className="w-full max-h-[400px] overflow-y-auto">
                        <div className="p-6 bg-white max-w-5xl rounded-lg ">
                            <table className="w-full border-collapse bg-white shadow-sm rounded-lg ">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 border-b">
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">id</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">Nome do produto</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">Nome do cliente</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">Data de reserva</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">Data de entrega</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">Valor</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium py-3 px-4 text-left">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {recentData.map((data, index) => (
                                        <tr
                                            key={data.id}
                                            className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                } hover:bg-gray-100 transition-colors`}
                                        >
                                            <td className="py-3 px-4 border-b">
                                                <a
                                                    href="#"
                                                    className="text-gray-600 text-sm font-medium hover:text-blue-500 truncate"
                                                >
                                                    {data.id}
                                                </a>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span className="text-[13px] font-medium text-gray-500">
                                                    {data.customerName}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span className="text-[13px] font-medium text-gray-500">
                                                    {data.productId}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span className="text-[13px] font-medium text-gray-500">
                                                    {data.orderDate}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span className="text-[13px] font-medium text-gray-500">
                                                    {data.orderDate}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span className="text-[13px] font-medium text-gray-500">
                                                    {data.orderStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b flex items-center gap-2">
                                                <Link
                                                    to="#"
                                                    className="text-sky-500 hover:text-sky-700 transition-transform transform hover:scale-110"
                                                >
                                                    <MdModeEdit />
                                                </Link>
                                                <button
                                                    className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                                                    onClick={() => setIsOpen(true)}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <Dialog
                                                    open={isOpen}
                                                    onClose={() => setIsOpen(false)}
                                                    className="relative z-50"
                                                >
                                                    <div className="fixed inset-0 bg-black bg-opacity-30"></div>
                                                    <div className="fixed inset-0 flex items-center justify-center p-4">
                                                        <Dialog.Panel className="max-w-lg w-full bg-white p-6 shadow-lg rounded-md">
                                                            <Dialog.Title className="font-bold text-lg text-gray-800">
                                                                Eliminar Produto
                                                            </Dialog.Title>
                                                            <Dialog.Description className="text-gray-500 mb-4">
                                                                Esta ação não pode ser revertida.
                                                            </Dialog.Description>
                                                            <p className="text-sm text-gray-600 mb-6">
                                                                Tem certeza de que deseja eliminar este produto?
                                                            </p>
                                                            <div className="flex justify-end gap-4">
                                                                <button
                                                                    onClick={() => setIsOpen(false)}
                                                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                                                >
                                                                    Cancelar
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
                    </div>
                </div>

            </div>
        </div>
    )
}
