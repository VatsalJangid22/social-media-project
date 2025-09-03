import React, { useState } from 'react';
import { Label } from './ui/label'
import { Input } from './ui/input'
import logoImg from '../assets/images/logo.png'
import { Button } from './ui/button'
import axios from "axios"
import {toast} from "sonner"
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';


function Signup() {

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);

        try {
            setLoading(true);
            const res = await axios.post("https://social-media-project-v2n6.onrender.com/api/v1/user/register", input, {
                headers:{
                    "Content-Type" : "application/json"
                },
                withCredentials: true
            });

            if(res.data.success){
                navigate("/login")
                toast.success(res.data.message);
                setInput({
                    username: "",
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                    <p className="text-gray-600">Join our community today</p>
                </div>
                
                <form onSubmit={signupHandler} className='space-y-6'>
                    <div>
                        <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            value={input.username}
                            onChange={changeEventHandler}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    
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
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    
                    <div>
                        {loading ? (
                            <Button disabled className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                                <Loader2 className='animate-spin h-4 w-4 mr-2'/>
                                Creating account...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                Create account
                            </Button>
                        )}
                    </div>
                </form>
                
                <div className='text-center mt-6'>
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signup