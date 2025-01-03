import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Perfil() {
    const id = localStorage.getItem("user_id")
    const [error, setError] = useState('')
    const [profileError, setProfileError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        nome: '',
        email: '',
    })
    const [passwordData, setPasswordData] = useState({
        novaPassword: '',
        confirmPassword: '',
    })

    return (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-scroll ">
            <div className="p-4 space-y-8 pb-20">
                <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
                    <h2 className="font-semibold text-2xl text-gray-300 mb-6">
                        Dados de Perfil
                    </h2>
                    <form onSubmit={''} className="space-y-6">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                Nome
                            </label>
                            <input
                                id="nome"
                                name='nome'
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                value={userData.nome}
                                //onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="profile-email"
                                name='email'
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                value={userData.email}
                                //onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
                    <h2 className="font-semibold text-2xl text-gray-300 mb-6">
                        Alterar Senha
                    </h2>
                    <p className='text-red text-sm font-semibold text-rose-500'>{passwordError}</p>
                    <form onSubmit={''} className="space-y-6">
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                Nova senha
                            </label>
                            <input
                                id="novaPassword"
                                name='novaPassword'
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
                                value={passwordData.novaPassword}
                                //onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                Confirmar Senha
                            </label>
                            <input
                                id="confirmPassword"
                                name='confirmPassword'
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
                                value={passwordData.confirmPassword}
                                //onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
                    <h2 className="font-semibold text-2xl text-gray-300 mb-6">
                        Eliminar Conta
                    </h2>
                    <p>
                        Essa acção é irreversível. Tenha certeza do que deseja fazer.
                    </p>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                           // onClick={handleDeleteAccount}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
