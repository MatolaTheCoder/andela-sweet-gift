import React, { useState, useEffect } from 'react' 
import Swal from 'sweetalert2' 
import axios from 'axios' 
import { useNavigate } from 'react-router-dom' 
import { Link } from 'react-router-dom' 
import swal from 'sweetalert2'

export default function Login() {
    const [email, setEmail] = useState("") 
    const [password, setPassword] = useState("") 
    const [error, setError] = useState('') 
    const navigate = useNavigate() 
    const [isSubmitting, setIsSubmitting] = useState(false) 

    useEffect(() => {
        axios.defaults.baseURL = 'http://localhost:8000' 
    }, []) 

    const handleLogin = async (e) => {
        e.preventDefault() 
        setError('') 
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/login", 
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            ) 

            if (!response.data.success) {
                console.log(response.data)
            } else {
                const { user, token, tipo_utilizador_id: tipo, estabelecimento } = response.data 
                localStorage.setItem('token', token) 

                navigate('/') 

            }

        } catch (error) {
            swal(
                'Fal!',
                'Your imaginary file has been deleted.'.error,
                'error'
              )
            console.error('Erro na requisição:', error.response?.data || error.message) 
        } finally {
            setIsSubmitting(false) 
        }
    } 

    return (
        <>
        <div className="flex items-center justify-center h-[calc(100vh-85px)] bg-gray-100">
            <div className="w-full max-w-md  bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <button
                    className="w-full font-bold shadow-sm rounded-lg py-3 my-7 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-indigo-200 focus:outline-none">
                    <div className="bg-white p-2 rounded-full">
                        <svg className="w-4" viewBox="0 0 533.5 544.3">
                            <path
                                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                fill="#4285f4" />
                            <path
                                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                fill="#34a853" />
                            <path
                                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                fill="#fbbc04" />
                            <path
                                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                fill="#ea4335" />
                        </svg>
                    </div>
                    <span className="ml-4">Sign Up with Google</span>
                </button>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
                    >
                        {isSubmitting ? 'A processar...' : 'Entrar'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem uma conta?{" "}
                    <Link to="/register" className="text-indigo-500 hover:underline">
                        Registre-se
                    </Link>
                </p>
            </div>
        </div>
        </>
    ) 
}