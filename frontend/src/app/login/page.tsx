"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { useState,ChangeEvent } from "react";

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const loginData = {
      username: username,
      password: password
    };

    const response  = await axios.post('http://localhost:8000/auth/token', loginData)
    if(response.data){
      const token = response.data.access_token;
      localStorage.setItem('token', token); // Store token in local storage
      console.log("succesfull")
      router.push("/chat")
    }
    else{
      alert("error logging in , please try again")
    }
    
  }

  return (
    <div className="bg-gradient-to-r from-green-200 via-white to-rose-200 flex flex-col justify-center items-center min-h-screen">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Log In</button>
        </form>
        {/* <p className="mt-4">
          Don't have an account? 
          <Link href="/register">
            <a className="text-blue-500 hover:underline">Sign up</a>
          </Link>
        </p> */}
      </div>
    </div>
  );
}
