"use client"
import Link from "next/link"
import axios from "axios";
import Image from "next/image";
import { File } from 'lucide-react';
import ChatSkeleton from "@/components/ui/chatskeleton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Message from "@/components/ui/message";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState,useEffect,ChangeEvent,KeyboardEventHandler } from "react"
import UploadFile from "@/components/uploadFile";
export default function chat() {
    const [blobName , setBlobName ] =useState("termpaper.pdf")
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [username, setUserName ] = useState('')
    const [isLoading , setIsLoading] = useState(false)
    const [ retrieverType , setRetrieverType] = useState('base')
    const [messages, setMessages] = useState([
        { text: `Hi ${username}! How can I help you today?`, fromUser: false },
      ]);
    const [inputValue, setInputValue] = useState("");

    const getUser = async () => {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          if (!token) {
            throw new Error('Token not found');
          }
          const response = await axios.get('http://localhost:8000/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("User data:", response.data.User.username);
          setUserName(response.data.User.username)
          setMessages([{text: `Hi ${response.data.User.username}! How can I help you today?`, fromUser: false}])
          return response.data;
         
        } catch (error) {
          throw error;
        }
      };

      const handleQueryDocument = async () => {
        try {
          console.log(retrieverType)
          const response = await axios.post("http://localhost:8000/document/query", {
            document_name: blobName,
            query: inputValue,
            retriever_type : retrieverType
          });
          // Assuming the response contains the answer
          const answer = response.data.answer;
          console.log("Answer:", answer);
          return answer
        } catch (error) {
          console.error("Error querying document:", error);
        }
      };
    
      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      };
      
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
         handleSendMessage(); 
        }
      };

      const handleUploadClick = () => {
        setIsUploadPopupOpen(true);
      };
    
      const handleCloseUploadPopup = () => {
        setIsUploadPopupOpen(false);
      };

      const handleRetrieverTypeChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setRetrieverType(e.target.value);
      };
    
      const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;
        setIsLoading(true)
        const answer = await handleQueryDocument();
        setIsLoading(false)
        setMessages([
          ...messages,
          { text: inputValue, fromUser: true },
          { text: answer, fromUser: false },
        ]);
        setInputValue("");
      };


      useEffect(()=>{
        getUser()
      },[blobName])
  return (
    <div className="flex flex-col h-screen w-full min-h-screen">
      <header className="flex h-16 w-full items-center border-b bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 border-gray-200 dark:border-gray-800">
        <div className="container flex w-full justify-center items-center  px-2 ">
          <Link className="flex items-center font-semibold text-gray-900 dark:text-gray-50" href="#">
            <Image src="/aiplanet_logo.png" width={110} height={30} alt="AI planet"/>
          </Link>
          <div className="ml-auto flex justify-between items-center gap-4">
          <Select onValueChange={setRetrieverType}>
            <SelectTrigger className="w-[200px] border border-green-600">
               <SelectValue placeholder="Select Retrieval Type" />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                 <SelectLabel>Retrieval Type</SelectLabel>
                 <SelectItem value="base">Base Retriever</SelectItem>
                 <SelectItem value="multiretriever">MultiQuery Retrieval</SelectItem>
                 <SelectItem value="compressionretriever">Compression Retrieval</SelectItem>
               </SelectGroup>
            </SelectContent>
          </Select>

            <div className="text-green-700 flex flex-row justify-between w-36">
              <File className="h-14"/>
              <h1 className="self-center">{blobName}</h1>
            </div>
            <Button className="rounded-full" size="icon" variant="outline" onClick={handleUploadClick}>
              <UploadIcon className="h-4 w-4" />
              <span className="sr-only">Upload</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col w-full">
      <div className="grid flex-1 w-full min-h-0 flex flex-col overflow-auto">
            <div className="container flex flex-1 w-full flex-col justify-items-start gap-4 py-8 px-4">
              <div className="grid gap-4">
                {messages.map((message, index) => (
                  <Message key={index} message={message} />
                ))}
              </div>
              {isLoading && <ChatSkeleton />}
          </div>
        </div>
        {isUploadPopupOpen && (
          <UploadFile onClose={handleCloseUploadPopup} setBlobName={setBlobName} />
        )}
        <div className=" grid w-full py-4 items-center">
          <div className="container flex w-full justify-center gap-4 px-2">
            <Input className=" flex-1" placeholder="Type a message..." type="text" value={inputValue}
              onChange={handleInputChange} onKeyDown={handleKeyDown}/>
            <Button className="bg-green-600" onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function UploadIcon(props : any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>
    )
  }
  
