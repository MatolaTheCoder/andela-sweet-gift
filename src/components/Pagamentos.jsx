import React, { useState } from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

const transactions = [
    { id: 1, cliente: "João Silva", valor: 100.0, metodo: "Cartão", data: "2025-01-01", status: "Pago" },
    { id: 2, cliente: "Maria Oliveira", valor: 250.0, metodo: "PayPal", data: "2025-01-02", status: "Pendente" },
    { id: 3, cliente: "Carlos Santos", valor: 75.5, metodo: "MB Way", data: "2025-01-03", status: "Falhado" },
    // Mais dados fictícios
];

export default function Pagamentos() {
    const [filter, setFilter] = useState("");

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.cliente.toLowerCase().includes(filter.toLowerCase()) ||
            transaction.status.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-4 min-h-screen">
            {/* Título e Resumo */}
            <div className="title text-gray-700 flex text-lg p-4 font-semibold ">
                <p className=''>Transações</p>
            </div>
            <div className="bg-white p-4">

                <div className="mb-6 bg-white">

                    <div className="mt-2 flex justify-between ">
                        <div>
                            <p className="text-gray-600">Total Recebido: <span className="text-green-500 font-bold">425.00 MT</span></p>
                            <p className="text-gray-600">Total Pendente: <span className="text-orange-500 font-bold">250.00 MT</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2">
                                <FaFilePdf /> Exportar PDF
                            </button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                                <FaFileExcel /> Exportar Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-6 flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Pesquisar por cliente ou status"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded w-full"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <MdFilterList /> Filtrar
                    </button>
                </div>

                {/* Tabela de Transações */}
                <table className="w-full bg-white shadow-md rounded overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Cliente</th>
                            <th className="py-3 px-4 text-left">Valor </th>
                            <th className="py-3 px-4 text-left">Data</th>
                            <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-100">
                                    <td className="py-3 px-4">{transaction.id}</td>
                                    <td className="py-3 px-4">{transaction.cliente}</td>
                                    <td className="py-3 px-4">{transaction.valor.toFixed(2)}</td>
                                    <td className="py-3 px-4">{transaction.data}</td>
                                    <td
                                        className={`py-3 px-4 font-semibold `}
                                    >
                                        <span className={` ${transaction.status === "Pago" ? "text-emerald-400/75  rounded-full py-1.5 px-4 font-medium bg-gray-100" : transaction.status === "Pendente" ? "text-yellow-400/75  rounded-full py-1.5 px-4 font-medium bg-gray-100" : "text-rose-400 rounded-full py-1.5 px-4 font-medium bg-gray-100"
                                            }`}> {transaction.status}</span>
                                        
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                                    Nenhuma transação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
