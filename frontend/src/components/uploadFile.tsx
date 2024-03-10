import React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { url } from 'inspector';
interface UploadPopupProps {
    onClose: () => void;
    setBlobName : (s: string)=>void
}

const UploadFile:React.FC<UploadPopupProps> = ({ onClose,setBlobName }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      if (file.type != "application/pdf"){
        alert("Only PDF files are supported currently!")
        return ;
      } 
      console.log(file)
      setUploadedFile(file);
    };

    const onFileUpload = async()=>{
      if (!uploadedFile) return; // Ensure a file is selected
      setIsProcessing(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await axios.post('http://localhost:8000/document/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });

        console.log('File uploaded successfully:', response.data);
        setBlobName(response.data.filename)
  
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        setIsProcessing(false);
        onClose();
    }
      setIsProcessing(false);
      onClose();
    }
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {isProcessing ? (
            <div className="animate-pulse">Processing...</div>
          ) : (
            <>
             <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className='text-green-600'>Upload Your File</CardTitle>
              <CardDescription >It might take some time depending upon the size of your file! </CardDescription>
            </CardHeader>
            <CardContent>
            <input type="file" onChange={handleFileUpload} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={onFileUpload} className='bg-green-600' >Upload</Button>
            </CardFooter>
          </Card>
            </>
          )}
        </div>
      </div>
    );
  };

export default UploadFile;