import React from 'react';
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar"
interface MessageProps {
  message: {
    text: string;
    fromUser: boolean;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`rounded-xl p-4 ${message.fromUser ? "dark:bg-gray-800" : ""}`}>
      <div className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12 self-start">
            <AvatarImage src={`${message.fromUser ? "" : "ai_logo.png"}`}/>
            <AvatarFallback className=' bg-gray-300'>{message.fromUser ? "U" : "AI"}</AvatarFallback>
          </Avatar>
          <h2 className="text-base text-black dark:text-gray-400">{message.text}</h2>
        </div>
      </div>
    </div>
  );
};

export default Message;
