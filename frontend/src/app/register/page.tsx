"use client"
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useState,ChangeEvent } from "react";
export default function Registration() {
  const [username,setUserName] = useState('');
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (event:ChangeEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const userData = {
      username: username,
      password: password
    };
    const result = await axios.post('http://localhost:8000/auth/create/user', userData)
    console.log(result.data)
    if(result.data){
      router.push("/login")
    }
  }
  return (
    <div className="bg-gradient-to-r from-green-200 via-white to-rose-200 flex flex-col justify-center items-center min-h-screen">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Registration</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700">Username</label>
            <input type="text" id="fullname" name="fullname" onChange={(e) => setUserName(e.target.value)} 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Register</button>
        </form>
        {/* <a className="mt-4">
          Already have an account? 
          <Link href="/login">
            <p className="text-blue-500 hover:underline">Log in</p>
          </Link>
        </a> */}
      </div>
    </div>
  );
}
