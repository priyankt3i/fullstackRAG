import TypeWriter from "@/components/TypeWriter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
export default function Home() {
  return (
   <div className="bg-gradient-to-r from-green-200 flex flex-col 
   via-white to-rose-200 w-100 h-100 min-h-screen">
     <Navbar />
     <div className="flex flex-col justify-center items-center flex-grow">
      <h1 className="text-5xl font-semibold text-center w-2/6">
        AI <span className="text-green-600">Document</span> assistant
     </h1>
     <h2 className="font-medium text-3xl my-2.5" >
       <TypeWriter />
     </h2>
     <Link href="/login">
       <Button className="bg-green-600 my-5">Get Started
       <ArrowRight className="ml-2 h-5 w-5" strokeWidth={3}/>
       </Button>
       
     </Link>
   </div>
   </div>
  )
}
 