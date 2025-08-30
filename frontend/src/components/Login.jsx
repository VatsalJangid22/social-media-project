import React, { useEffect, useState } from 'react';
import { Label } from './ui/label'
import { Input } from './ui/input'
import logoImg from '../assets/images/logo.png'
import { Button } from './ui/button'
import axios from "axios"
import {toast} from "sonner"
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

function Login() {

    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:7000/api/v1/user/login", input, {
                headers:{
                    "Content-Type" : "application/json"
                },
                withCredentials: true
            });

            if(res.data.success){
                dispatch(setAuthUser(res.data.user));
                navigate("/")
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
    }

    const {user} = useSelector(store=>store.auth);

    useEffect(() => {
        if(user){
            navigate("/")
        }
    },[])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
            <div className='bg-white rounded-lg shadow-lg p-6 sm:p-8'>
                <div className='text-center mb-8'>
                    <div className="flex justify-center mb-6">
                        <img src={logoImg} alt="Logo" className="h-20 w-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>
                
                <form onSubmit={signupHandler} className='space-y-6'>
                    <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <div>
                        {loading ? (
                            <Button disabled className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                                <Loader2 className='animate-spin h-4 w-4 mr-2'/>
                                Signing in...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                Sign in
                            </Button>
                        )}
                    </div>
                </form>
                
                <div className='text-center mt-6'>
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login