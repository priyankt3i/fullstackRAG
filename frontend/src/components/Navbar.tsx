import Link from 'next/link'
import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
export default function Navbar() {
  return (
    <div className='sticky flex flex-row justify-between  px-6 
    py-2 items-center border-b border-black bg-white min-w-full'>
      <div className='font-bold'>
        <Link href="/">PR RAG Portal</Link>
      </div>

      <div className='flex flex-row justify-between  '> 
         <Button asChild variant={"ghost"}>
           <Link href="/pricing">Pricing</Link>
         </Button>
         <Button asChild variant={"ghost"}>
           <Link href="/register">Sign Up</Link>
         </Button>
         <Button asChild variant={"outline"} className='bg-black text-white'>
           <Link href="/login">Get Started
           <ArrowRight className="ml-2 h-5 w-5" />

           </Link>
         </Button>
         
      </div>
    </div>
  )
}

