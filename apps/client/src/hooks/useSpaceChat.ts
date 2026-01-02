import { useEffect, useState } from "react";

export type ChatMessage = {
  userId: string;
  text: string;
  spaceId: string;
  name: string;
  avatarId: string; 
  timestamp: number; 
};

let listeners: ((m: ChatMessage) => void)[] = [];

export const pushMessage = (msg: ChatMessage) => {
  listeners.forEach(l => l(msg));
};

export const useSpaceChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const add = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    };

    listeners.push(add);

    return () => {
      listeners = listeners.filter(l => l !== add);
    };
  }, []);

  return messages;
};

